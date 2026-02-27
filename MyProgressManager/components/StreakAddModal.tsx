import React, { useState } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  Modal,
  Portal,
  TextInput,
  Button,
} from "react-native-paper";

import { supabase } from "../lib/supabaseClient";
import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";

import { createStreakAddModalStyles } from "../styles/StreakAddModalStyles";

const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS === "web") return <View>{children}</View>;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (streakFromDB: any) => void;
}

interface IncProps {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  styles: any;
  theme: any;
}

const Incrementer: React.FC<IncProps> = ({
  label,
  value,
  setValue,
  min,
  max,
  styles,
  theme,
}) => {
  const increase = () => {
    if (value < max) setValue(value + 1);
  };
  const decrease = () => {
    if (value > min) setValue(value - 1);
  };

  return (
    <View style={styles.pickerColumn}>
      <Text style={{ color: theme.text, marginBottom: 4 }}>{label}</Text>

      <TouchableOpacity onPress={increase} style={styles.bracketButton}>
        <Text style={styles.bracketButtonTextPrimary}>⌃</Text>
      </TouchableOpacity>

      <Text style={styles.numberDisplay}>{value}</Text>

      <TouchableOpacity onPress={decrease} style={styles.bracketButton}>
        <Text style={styles.bracketButtonTextPrimary}>⌄</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function StreakAddModal({ visible, onClose, onAdd }: Props) {
  const { theme, paperTheme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();
  const styles = createStreakAddModalStyles(theme, fontSize, fontWeight);

  const [title, setTitle] = useState("");

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);

  const resetFields = () => {
    setTitle("");
    setDays(0);
    setHours(0);
    setMinutes(0);
  };

  const handleAdd = async () => {
    const durationSeconds = days * 86400 + hours * 3600 + minutes * 60;

    if (!title.trim() || durationSeconds <= 0) return;

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("streaks")
      .insert({
        user_id: user.id,
        title: title.trim(),
        duration_seconds: durationSeconds,
        cooldown_end: null,
        streak_count: 0,
        last_tap_at: null,
      })
      .select()
      .single();

    if (error) {
      console.log("Streak insert error:", error);
      return;
    }

    onAdd(data);
    resetFields();
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <ContentWrapper>
          <View>
            <Text style={styles.title}>Create New Streak</Text>

            <TextInput
              label="Streak Name"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              theme={paperTheme}
              style={styles.input}
              textColor={theme.text}
            />

            <Text style={styles.durationLabel}>Duration</Text>

            <View style={styles.pickerRow}>
              <Incrementer
                label="Days"
                value={days}
                setValue={setDays}
                min={0}
                max={10}
                styles={styles}
                theme={theme}
              />

              <Incrementer
                label="Hours"
                value={hours}
                setValue={setHours}
                min={0}
                max={23}
                styles={styles}
                theme={theme}
              />

              <Incrementer
                label="Minutes"
                value={minutes}
                setValue={setMinutes}
                min={0}                     
                max={59}
                styles={styles}
                theme={theme}
              />
            </View>

            <View style={styles.actionRow}>
              <Button mode="text" onPress={onClose} textColor={theme.primary}>
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleAdd}
                buttonColor={theme.primary}
                textColor={theme.text}
                style={styles.addButton}
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
