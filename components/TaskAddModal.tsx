import React, { useState } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
} from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { createTaskModalStyles } from "../styles/TaskModalStyles";
import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string, color: string, dueDate: Date) => void;
}

const PRESET_COLORS = [
  "#7EC8EB",
  "#2856ffff",
  "#0037ffff",
  "#4c34c5ff",
  "#6536bcff",
  "#ad5fe2ff",
];

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === "web") return <View>{children}</View>;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default function TaskAddModal({ visible, onClose, onAdd }: Props) {
  const { theme, paperTheme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();
  const styles = createTaskModalStyles(theme);

  const [text, setText] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAddTask = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), color, new Date(date));
    setText("");
    setColor(PRESET_COLORS[0]);
    setDate(new Date());
    handleClose();
  };

  const handleClose = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    onClose();
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      const current = new Date(date);
      current.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(current);
    }

    setShowDatePicker(false);
  };


  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }

    if (event.type === "set" && selectedTime) {
      const current = new Date(date);
      current.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      setDate(current);
      setShowTimePicker(false); 
    }

  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.container}
      >
        <ContentWrapper>
          <View>
            <Text
              variant="titleLarge"
              style={[
                styles.title,
                { fontSize: fontSize(26), fontWeight: fontWeight() },
              ]}
            >
              Create New Task
            </Text>

            <TextInput
              label="Task Description"
              value={text}
              onChangeText={setText}
              style={[styles.input, { fontSize: fontSize(16) }]}
              mode="outlined"
              placeholderTextColor={theme.text + "80"}
              theme={paperTheme}
            />

            <Button
              mode="outlined"
              style={[styles.input, { alignSelf: "stretch" }]}
              onPress={() => setShowDatePicker(true)}
              textColor={theme.text}
            >
              Due Date: {date.toLocaleDateString()}
            </Button>

            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onDateChange}
                />
              </View>
            )}

            <Button
              mode="outlined"
              style={[styles.input, { alignSelf: "stretch" }]}
              onPress={() => setShowTimePicker(true)}
              textColor={theme.text}
            >
              Due Time:{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Button>

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onTimeChange}
              />
            )}

            <View style={styles.colorRow}>
              {PRESET_COLORS.map((c) => (
                <Button
                  key={c}
                  mode={color === c ? "contained" : "outlined"}
                  onPress={() => setColor(c)}
                  style={[styles.colorButton, { backgroundColor: c }]}
                  labelStyle={{
                    color: "#000",
                    fontSize: fontSize(12),
                    fontWeight: fontWeight(),
                  }}
                >
                  {color === c ? "✓" : ""}
                </Button>
              ))}
            </View>

            <View style={styles.row}>
              <Button
                mode="text"
                onPress={handleClose}
                style={styles.button}
                textColor={theme.primary}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleAddTask}
                style={styles.button}
                buttonColor={theme.primary}
                textColor={theme.text}
              >
                Add
              </Button>
            </View>
          </View>
        </ContentWrapper>
      </Modal>
    </Portal>
  );
}
