import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";
import { useAuth } from "../context/AuthProvider";
import { AgentConfig, AgentConfigInput } from "../services/agent";
import {
  AGENT_AVATARS,
  getAgentAvatarSource,
  normalizeAvatarKey,
} from "../constants/agentAvatars";
import {
  AGENT_NAME_SUGGESTIONS,
  buildAgentQuestions,
} from "../constants/agentQuestions";
import {
  createAgentSetupStyles,
  AGENT_AVATAR_GRID_HEIGHT,
} from "../styles/AgentSetupStyles";
import { scale } from "../utils/responsive";

export interface AgentSetupProps {
  visible: boolean;
  mode?: "onboarding" | "edit";
  initialConfig?: AgentConfig | null;
  onDismiss: () => void;
  onSave: (input: AgentConfigInput) => Promise<void> | void;
}

export default function AgentSetup({
  visible,
  mode = "onboarding",
  initialConfig = null,
  onDismiss,
  onSave,
}: AgentSetupProps) {
  const { theme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();
  const { user } = useAuth();
  const styles = createAgentSetupStyles(theme);

  const questions = useMemo(
    () => buildAgentQuestions(user?.firstName),
    [user?.firstName]
  );

  const totalSteps = questions.length + 2;

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appear = useRef(new Animated.Value(0)).current;
  const transition = useRef(new Animated.Value(1)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const scrollRef = useRef<ScrollView>(null);
  const busyRef = useRef(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      const initialAnswers: Record<string, string> = {};
      questions.forEach((question) => {
        initialAnswers[question.id] = initialConfig?.behavior?.[question.prompt] ?? "";
      });

      setStep(0);
      setName(initialConfig?.name ?? "");
      setAvatar(normalizeAvatarKey(initialConfig?.avatar));
      setAnswers(initialAnswers);
      setPickerOpen(false);
      setSaving(false);
      setError(null);

      busyRef.current = false;
      transition.setValue(1);
      offset.setValue(0);
      gridAnim.setValue(0);
      progress.setValue(0);
      appear.setValue(0);
      setMounted(true);

      Animated.timing(appear, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(appear, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: totalSteps > 1 ? step / (totalSteps - 1) : 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step, totalSteps, progress]);

  useEffect(() => {
    Animated.timing(gridAnim, {
      toValue: pickerOpen ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pickerOpen, gridAnim]);

  useEffect(
    () => () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    },
    []
  );

  const goToStep = (next: number) => {
    if (busyRef.current || next === step || next < 0 || next >= totalSteps) return;

    busyRef.current = true;
    Keyboard.dismiss();
    const direction = next > step ? 1 : -1;

    Animated.parallel([
      Animated.timing(transition, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: -scale(14) * direction,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        busyRef.current = false;
        return;
      }

      setStep(next);
      setPickerOpen(false);
      setError(null);
      offset.setValue(scale(16) * direction);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ y: 0, animated: false })
      );

      Animated.parallel([
        Animated.timing(transition, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        busyRef.current = false;
      });
    });
  };

  const selectAvatar = (key: string) => {
    setAvatar(key);
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => setPickerOpen(false), 220);
  };

  const setAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const buildBehavior = () => {
    const behavior: Record<string, string> = {};
    questions.forEach((question) => {
      behavior[question.prompt] = (answers[question.id] ?? "").trim();
    });
    return behavior;
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim() || null,
        avatar,
        behavior: buildBehavior(),
      });
    } catch (err: any) {
      setError(
        err?.message
          ? `Could not save your agent: ${err.message}`
          : "Could not save your agent. Please try again."
      );
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    if (saving) return;
    Keyboard.dismiss();
    onDismiss();
  };

  const isIdentityStep = step === 0;
  const isSummaryStep = step === totalSteps - 1;
  const question = !isIdentityStep && !isSummaryStep ? questions[step - 1] : null;

  const trimmedName = name.trim();
  const canContinue = isIdentityStep
    ? trimmedName.length > 0 && !!avatar
    : question
    ? (answers[question.id] ?? "").trim().length > 0
    : true;
  const selectedSource = getAgentAvatarSource(avatar);
  const behaviorEntries = Object.entries(buildBehavior());

  const eyebrow = mode === "edit" ? "Update your agent" : "Step into your setup";
  const headerTitle = isIdentityStep
    ? "Meet your AI"
    : isSummaryStep
    ? "Ready to go"
    : trimmedName || "Your AI";

  const nextLabel = isSummaryStep
    ? mode === "edit"
      ? "Save changes"
      : "Save & finish"
    : step === totalSteps - 2
    ? "Review"
    : "Next";

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["4%", "100%"],
  });

  const cardStyle = {
    opacity: appear,
    transform: [
      {
        scale: appear.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1],
        }),
      },
      {
        translateY: appear.interpolate({
          inputRange: [0, 1],
          outputRange: [scale(24), 0],
        }),
      },
    ],
  };

  const renderChips = (
    options: string[],
    value: string,
    onSelect: (option: string) => void
  ) => (
    <View style={styles.chipsWrap}>
      {options.map((option) => {
        const active = value.trim() === option;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            style={[styles.chip, active && styles.chipSelected]}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                styles.chipText,
                active && styles.chipTextSelected,
                { fontSize: fontSize(13), fontWeight: fontWeight() },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderIdentityStep = () => (
    <>
      <View style={styles.avatarBlock}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.avatarButton, !!selectedSource && styles.avatarButtonFilled]}
          onPress={() => setPickerOpen((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel="Choose my appearance"
        >
          {selectedSource ? (
            <Image source={selectedSource} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <Feather name="message-circle" size={scale(44)} color={theme.textMuted} />
          )}

          <View style={styles.avatarEditBadge}>
            <Feather
              name={pickerOpen ? "chevron-up" : "edit-2"}
              size={scale(15)}
              color={theme.onPrimary}
            />
          </View>
        </TouchableOpacity>

        <Text style={[styles.avatarCaption, { fontSize: fontSize(14.5) }]}>
          Choose My Appearance
        </Text>
        <Text style={[styles.avatarHint, { fontSize: fontSize(12.5) }]}>
          {selectedSource
            ? "Tap the avatar to pick a different look."
            : "Tap the avatar to see the available looks."}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.grid,
          {
            height: gridAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, AGENT_AVATAR_GRID_HEIGHT],
            }),
            opacity: gridAnim,
          },
        ]}
        pointerEvents={pickerOpen ? "auto" : "none"}
      >
        <View style={styles.gridInner}>
          {AGENT_AVATARS.map((option) => {
            const active = option.key === avatar;
            return (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.85}
                style={[styles.gridTile, active && styles.gridTileSelected]}
                onPress={() => selectAvatar(option.key)}
                accessibilityRole="button"
                accessibilityLabel={`Avatar ${option.key}`}
                accessibilityState={{ selected: active }}
              >
                <Image
                  source={option.source}
                  style={styles.gridTileImage}
                  resizeMode="cover"
                />
                {active && (
                  <View style={styles.gridCheck}>
                    <Feather name="check" size={scale(11)} color={theme.onPrimary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      <View style={styles.nameBlock}>
        <Text style={[styles.fieldLabel, { fontSize: fontSize(15) }]}>
          What would you like to name your AI?
        </Text>
        <Text style={[styles.fieldHelper, { fontSize: fontSize(12.5) }]}>
          Pick something you will enjoy seeing every day.
        </Text>

        <TextInput
          style={[styles.input, { fontSize: fontSize(15) }]}
          value={name}
          onChangeText={setName}
          placeholder="Give your AI a name"
          placeholderTextColor={theme.textMuted}
          selectionColor={theme.primary}
          autoCorrect={false}
          maxLength={40}
          returnKeyType="done"
        />

        {renderChips(AGENT_NAME_SUGGESTIONS, name, setName)}
      </View>
    </>
  );

  const renderQuestionStep = () => {
    if (!question) return null;
    const value = answers[question.id] ?? "";

    return (
      <>
        <Text style={[styles.questionCounter, { fontSize: fontSize(12) }]}>
          {`QUESTION ${step} OF ${questions.length}`}
        </Text>

        <Text style={[styles.questionPrompt, { fontSize: fontSize(20), lineHeight: fontSize(27) }]}>
          {question.prompt}
        </Text>

        <Text style={[styles.fieldHelper, { fontSize: fontSize(12.5) }]}>
          {question.helper}
        </Text>

        <TextInput
          style={[
            styles.input,
            question.multiline && styles.inputMultiline,
            { fontSize: fontSize(15) },
          ]}
          value={value}
          onChangeText={(text) => setAnswer(question.id, text)}
          placeholder={question.placeholder}
          placeholderTextColor={theme.textMuted}
          selectionColor={theme.primary}
          multiline={question.multiline}
          maxLength={300}
        />

        {renderChips(question.suggestions, value, (option) =>
          setAnswer(question.id, value.trim() === option ? "" : option)
        )}
      </>
    );
  };

  const renderSummaryStep = () => (
    <>
      <View style={styles.summaryHeader}>
        <View style={styles.summaryAvatar}>
          {selectedSource ? (
            <Image source={selectedSource} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <Feather name="message-circle" size={scale(38)} color={theme.textMuted} />
          )}
        </View>

        <Text style={[styles.summaryName, { fontSize: fontSize(21) }]}>
          {trimmedName || "Your AI"}
        </Text>
        <Text style={[styles.summarySubtitle, { fontSize: fontSize(13), lineHeight: fontSize(19) }]}>
          {`${behaviorEntries.length} preference${
            behaviorEntries.length === 1 ? "" : "s"
          } saved. You can change any of this later from your profile.`}
        </Text>
      </View>

      {behaviorEntries.map(([prompt, answer]) => (
        <View key={prompt} style={styles.summaryRow}>
          <Text style={[styles.summaryQuestion, { fontSize: fontSize(12.5) }]}>
            {prompt}
          </Text>
          <Text
            style={[
              styles.summaryAnswer,
              { fontSize: fontSize(14.5), fontWeight: fontWeight(), lineHeight: fontSize(20) },
            ]}
          >
            {answer}
          </Text>
        </View>
      ))}
    </>
  );

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <Animated.View style={[styles.backdrop, { opacity: appear }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.centerWrap}>
          <Animated.View style={[styles.card, cardStyle]}>
            <View style={styles.header}>
              <View style={styles.headerTextWrap}>
                <Text style={[styles.eyebrow, { fontSize: fontSize(11.5) }]}>
                  {eyebrow}
                </Text>
                <Text style={[styles.headerTitle, { fontSize: fontSize(19) }]}>
                  {headerTitle}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.closeButton}
                onPress={handleDismiss}
                accessibilityRole="button"
                accessibilityLabel="Close agent setup"
              >
                <Feather name="x" size={scale(18)} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                style={[
                  styles.stepWrap,
                  { opacity: transition, transform: [{ translateX: offset }] },
                ]}
              >
                {isIdentityStep
                  ? renderIdentityStep()
                  : isSummaryStep
                  ? renderSummaryStep()
                  : renderQuestionStep()}

                {error && (
                  <Text style={[styles.errorText, { fontSize: fontSize(13) }]}>
                    {error}
                  </Text>
                )}
              </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
              {step > 0 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.backButton}
                  onPress={() => goToStep(step - 1)}
                  disabled={saving}
                  accessibilityRole="button"
                  accessibilityLabel="Previous step"
                >
                  <Feather name="chevron-left" size={scale(22)} color={theme.text} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.nextButton,
                  (!canContinue || saving) && styles.nextButtonDisabled,
                ]}
                onPress={() => (isSummaryStep ? handleSave() : goToStep(step + 1))}
                disabled={!canContinue || saving}
                accessibilityRole="button"
                accessibilityLabel={nextLabel}
              >
                {saving ? (
                  <ActivityIndicator color={theme.onPrimary} />
                ) : (
                  <>
                    <Text style={[styles.nextButtonText, { fontSize: fontSize(15.5) }]}>
                      {nextLabel}
                    </Text>
                    <Feather
                      name={isSummaryStep ? "check" : "chevron-right"}
                      size={scale(19)}
                      color={theme.onPrimary}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.skipRow}
              onPress={handleDismiss}
              disabled={saving}
              accessibilityRole="button"
            >
              <Text style={[styles.skipText, { fontSize: fontSize(13) }]}>
                {mode === "edit" ? "Cancel" : "Skip for now"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
