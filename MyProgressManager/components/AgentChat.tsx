import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Easing,
  ListRenderItemInfo,
  PanResponder,
  PanResponderGestureState,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";
import { useAgent } from "../context/AgentContext";
import { ApiError } from "../services/api";
import { AgentService, AgentMessage } from "../services/agent";
import {
  createAgentChatStyles,
  clampFabValue,
  snapFabPosition,
  AGENT_PANEL_HEIGHT,
  AGENT_FAB_SHIFT,
  AGENT_FAB_REST_TOP,
  AGENT_FAB_MAX_X,
  AGENT_FAB_MIN_Y,
  AGENT_FAB_MAX_Y,
  AGENT_FAB_DEFAULT_POSITION,
} from "../styles/AgentChatStyles";
import { scale } from "../utils/responsive";

interface AgentChatProps {
  scrollY?: Animated.Value;
}

const SUGGESTIONS = [
  "How am I doing this week?",
  "Summarize my streaks",
  "What should I focus on?",
];

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 1 };

const DRAG_THRESHOLD = 5;

export default function AgentChat({ scrollY }: AgentChatProps) {
  const { theme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();
  const { agentName, avatarSource, fabPosition, setFabPosition } = useAgent();
  const styles = createAgentChatStyles(theme);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const anim = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<AgentMessage>>(null);
  const idRef = useRef(0);
  const sessionRef = useRef("");
  const sendingRef = useRef(false);

  const staticScroll = useRef(new Animated.Value(0)).current;
  const scrollSource = scrollY ?? staticScroll;

  const positionRef = useRef(fabPosition ?? AGENT_FAB_DEFAULT_POSITION);
  const fabPos = useRef(new Animated.ValueXY(positionRef.current)).current;
  const dragScale = useRef(new Animated.Value(1)).current;
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!fabPosition) return;
    if (
      fabPosition.x === positionRef.current.x &&
      fabPosition.y === positionRef.current.y
    ) {
      return;
    }
    positionRef.current = fabPosition;
    fabPos.setValue(fabPosition);
  }, [fabPosition, fabPos]);

  useEffect(() => {
    if (fabPosition) return;

    const id = scrollSource.addListener(({ value }) => {
      if (draggingRef.current) return;
      const progress = clampFabValue(value, 0, 70) / 70;
      const next = {
        x: AGENT_FAB_DEFAULT_POSITION.x,
        y: AGENT_FAB_REST_TOP - progress * AGENT_FAB_SHIFT,
      };
      positionRef.current = next;
      fabPos.setValue(next);
    });

    return () => scrollSource.removeListener(id);
  }, [fabPosition, scrollSource, fabPos]);

  const finishDrag = (gesture: PanResponderGestureState) => {
    draggingRef.current = false;
    const target = snapFabPosition(
      positionRef.current.x + gesture.dx,
      positionRef.current.y + gesture.dy
    );
    positionRef.current = target;
    setFabPosition(target);

    Animated.parallel([
      Animated.spring(fabPos, {
        toValue: target,
        useNativeDriver: false,
        friction: 7,
        tension: 70,
      }),
      Animated.spring(dragScale, {
        toValue: 1,
        useNativeDriver: false,
        friction: 6,
        tension: 120,
      }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_evt, gesture) =>
        Math.abs(gesture.dx) > DRAG_THRESHOLD ||
        Math.abs(gesture.dy) > DRAG_THRESHOLD,
      onPanResponderGrant: () => {
        draggingRef.current = true;
        Animated.spring(dragScale, {
          toValue: 1.12,
          useNativeDriver: false,
          friction: 6,
          tension: 120,
        }).start();
      },
      onPanResponderMove: (_evt, gesture) => {
        fabPos.setValue({
          x: clampFabValue(positionRef.current.x + gesture.dx, 0, AGENT_FAB_MAX_X),
          y: clampFabValue(
            positionRef.current.y + gesture.dy,
            AGENT_FAB_MIN_Y,
            AGENT_FAB_MAX_Y
          ),
        });
      },
      onPanResponderRelease: (_evt, gesture) => finishDrag(gesture),
      onPanResponderTerminate: (_evt, gesture) => finishDrag(gesture),
    })
  ).current;

  const fabTransform = [
    { translateX: fabPos.x },
    { translateY: fabPos.y },
    { scale: dragScale },
  ];

  const gradientColors = [theme.primary, theme.accent] as const;

  const makeId = () => {
    idRef.current += 1;
    return `${Date.now()}-${idRef.current}`;
  };

  useEffect(() => {
    if (open) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [open, anim]);

  const openChat = () => {
    setMessages([]);
    setInput("");
    setSending(false);
    sendingRef.current = false;
    sessionRef.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    anim.setValue(0);
    setMounted(true);
    setOpen(true);
  };

  const closeChat = () => {
    Keyboard.dismiss();
    Animated.timing(anim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setOpen(false);
      setMounted(false);
      setMessages([]);
      setInput("");
      setSending(false);
      sendingRef.current = false;
    });
  };

  const scrollToEnd = () => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const sendText = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || sendingRef.current) return;

    sendingRef.current = true;
    const userMessage: AgentMessage = {
      id: makeId(),
      role: "user",
      text: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    scrollToEnd();

    try {
      const reply = await AgentService.sendMessage(
        nextMessages.map(({ role, text }) => ({ role, text })),
        { sessionId: sessionRef.current }
      );
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          text: reply || "…",
        },
      ]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          text: message,
          error: true,
        },
      ]);
    } finally {
      sendingRef.current = false;
      setSending(false);
      scrollToEnd();
    }
  };

  const backdropStyle = { opacity: anim };
  const panelStyle = {
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [AGENT_PANEL_HEIGHT, 0],
        }),
      },
    ],
  };

  const canSend = input.trim().length > 0 && !sending;

  const renderMessage = ({ item }: ListRenderItemInfo<AgentMessage>) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.row, isUser ? styles.userRow : styles.assistantRow]}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            item.error && styles.errorBubble,
          ]}
        >
          <Text
            style={[
              isUser
                ? styles.userText
                : item.error
                ? styles.errorText
                : styles.assistantText,
              {
                fontSize: fontSize(15.5),
                fontWeight: fontWeight(),
                lineHeight: fontSize(21),
              },
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyAvatar}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <>
            <LinearGradient
              colors={gradientColors}
              start={GRADIENT_START}
              end={GRADIENT_END}
              style={styles.avatarGradient}
            />
            <Feather name="message-circle" size={scale(30)} color={theme.onPrimary} />
          </>
        )}
      </View>

      <Text style={[styles.emptyTitle, { fontSize: fontSize(21), fontWeight: fontWeight() }]}>
        How can I help?
      </Text>
      <Text style={[styles.emptySubtitle, { fontSize: fontSize(14.5), lineHeight: fontSize(21) }]}>
        Ask about your tasks, streaks, and progress and I&apos;ll help you stay on track.
      </Text>

      <View style={styles.chipsRow}>
        {SUGGESTIONS.map((suggestion) => (
          <TouchableOpacity
            key={suggestion}
            activeOpacity={0.8}
            style={styles.chip}
            onPress={() => sendText(suggestion)}
          >
            <Text style={[styles.chipText, { fontSize: fontSize(13.5), fontWeight: fontWeight() }]}>
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <Animated.View
        style={[styles.fabWrapper, { transform: fabTransform }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.fab}
          onPress={openChat}
          accessibilityRole="button"
          accessibilityLabel="Open AI assistant"
          accessibilityHint="Drag to move it to the left or right edge of the screen"
        >
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <>
              <LinearGradient
                colors={gradientColors}
                start={GRADIENT_START}
                end={GRADIENT_END}
                style={styles.fabGradient}
              />
              <Feather name="message-circle" size={scale(22)} color={theme.onPrimary} />
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={mounted}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeChat}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={closeChat} accessibilityRole="button">
            <Animated.View style={[styles.backdrop, backdropStyle]} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.panel, panelStyle]}>
            <View style={styles.grabber} />

            <View style={styles.header}>
              <View style={styles.headerAvatar}>
                {avatarSource ? (
                  <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <>
                    <LinearGradient
                      colors={gradientColors}
                      start={GRADIENT_START}
                      end={GRADIENT_END}
                      style={styles.avatarGradient}
                    />
                    <Feather name="message-circle" size={scale(19)} color={theme.onPrimary} />
                  </>
                )}
              </View>

              <View style={styles.headerTextWrap}>
                <Text style={[styles.headerTitle, { fontSize: fontSize(18), fontWeight: fontWeight() }]}>
                  {agentName}
                </Text>
                <Text style={[styles.headerSubtitle, { fontSize: fontSize(12.5) }]}>
                  Your progress companion
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.headerClose}
                onPress={closeChat}
                accessibilityRole="button"
                accessibilityLabel="Close AI assistant"
              >
                <Feather name="chevron-down" size={scale(22)} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={sending ? null : renderEmpty()}
                onContentSizeChange={scrollToEnd}
                ListFooterComponent={
                  sending ? (
                    <View style={[styles.row, styles.assistantRow]}>
                      <View style={styles.typingBubble}>
                        <TypingDots dotStyle={styles.typingDot} />
                      </View>
                    </View>
                  ) : null
                }
              />

              <View style={styles.inputBar}>
                <TextInput
                  style={[styles.input, { fontSize: fontSize(15.5) }]}
                  value={input}
                  onChangeText={setInput}
                  placeholder={`Message ${agentName}…`}
                  placeholderTextColor={theme.textMuted}
                  multiline
                  editable={!sending}
                  selectionColor={theme.primary}
                />

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.sendButton, !canSend && styles.sendDisabled]}
                  onPress={() => sendText(input)}
                  disabled={!canSend}
                  accessibilityRole="button"
                  accessibilityLabel="Send message"
                >
                  <LinearGradient
                    colors={gradientColors}
                    start={GRADIENT_START}
                    end={GRADIENT_END}
                    style={styles.sendGradient}
                  />
                  {sending ? (
                    <ActivityIndicator size="small" color={theme.onPrimary} />
                  ) : (
                    <Feather name="arrow-up" size={scale(22)} color={theme.onPrimary} />
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

interface TypingDotsProps {
  dotStyle: any;
}

function TypingDots({ dotStyle }: TypingDotsProps) {
  const d0 = useRef(new Animated.Value(0.35)).current;
  const d1 = useRef(new Animated.Value(0.35)).current;
  const d2 = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const dots = [d0, d1, d2];
    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 160),
          Animated.timing(dot, {
            toValue: 1,
            duration: 320,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.35,
            duration: 320,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [d0, d1, d2]);

  return (
    <>
      {[d0, d1, d2].map((dot, index) => (
        <Animated.View
          key={index}
          style={[dotStyle, { opacity: dot, transform: [{ scale: dot }] }]}
        />
      ))}
    </>
  );
}
