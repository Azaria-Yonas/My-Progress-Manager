// components/WeekSelector.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";
import { createWeekSelectorStyles } from "../styles/WeekSelectorStyles";
import { dateKey, isSameDay, startOfWeek, weekDays } from "../utils/weekDates";

const PAGE_WIDTH = Dimensions.get("window").width;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface WeekSelectorProps {
  weeks: Date[];
  selectedDate: Date;
  taskCounts: Record<string, number>;
  onSelectDate: (date: Date) => void;
}

export default function WeekSelector({
  weeks,
  selectedDate,
  taskCounts,
  onSelectDate,
}: WeekSelectorProps) {
  const { theme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();
  const styles = useMemo(
    () => createWeekSelectorStyles(theme, fontSize, fontWeight),
    [theme, fontSize, fontWeight]
  );

  const listRef = useRef<FlatList<Date>>(null);
  const visibleWeekRef = useRef<Date>(startOfWeek(selectedDate));

  const [initialIndex] = useState(() => {
    const index = weeks.findIndex((week) => isSameDay(week, visibleWeekRef.current));
    return index < 0 ? 0 : index;
  });

  useEffect(() => {
    const index = weeks.findIndex((week) => isSameDay(week, visibleWeekRef.current));
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: false });
    }
  }, [weeks]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    const week = weeks[index];
    if (week) visibleWeekRef.current = week;
  };

  const getItemLayout = (_: unknown, index: number) => ({
    length: PAGE_WIDTH,
    offset: PAGE_WIDTH * index,
    index,
  });

  const renderWeek = useCallback(
    ({ item }: { item: Date }) => (
      <View style={[styles.week, { width: PAGE_WIDTH }]}>
        {weekDays(item).map((day, index) => {
          const key = dateKey(day);
          const hasTasks = (taskCounts[key] ?? 0) > 0;
          const selected = isSameDay(day, selectedDate);

          return (
            <Pressable
              key={key}
              onPress={() => onSelectDate(day)}
              style={styles.dayCell}
            >
              <View style={[styles.dayPill, selected && styles.dayPillSelected]}>
                <Text
                  style={[
                    styles.dayNumber,
                    hasTasks && styles.dayTextActive,
                    selected && styles.dayTextSelected,
                  ]}
                >
                  {day.getDate()}
                </Text>

                <Text
                  style={[
                    styles.dayLabel,
                    hasTasks && styles.dayTextActive,
                    selected && styles.dayTextSelected,
                  ]}
                >
                  {DAY_LABELS[index]}
                </Text>

                <View
                  style={[
                    styles.dot,
                    hasTasks && styles.dotActive,
                    hasTasks && selected && styles.dotSelected,
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    ),
    [styles, taskCounts, selectedDate, onSelectDate]
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={weeks}
        keyExtractor={(item) => dateKey(item)}
        renderItem={renderWeek}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={PAGE_WIDTH}
        snapToAlignment="start"
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        initialNumToRender={3}
        windowSize={5}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
}
