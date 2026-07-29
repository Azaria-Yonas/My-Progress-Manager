// app/(tabs)/profile.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";

import { useThemeMode } from "../../context/ThemeContext";
import { useTypography } from "../../context/TypographyContext";
import { useAuth } from "../../context/AuthProvider";
import { useAgent } from "../../context/AgentContext";

import ReusableAnimatedHeader from "../../components/ReusableAnimatedHeader";
import { createReusableHeaderStyles } from "../../styles/ReusableHeaderStyles";
import { createProfileStyles } from "../../styles/ProfileStyles";
import BottomBar from "../../components/BottomBar";
import { useRouter } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { scale } from "../../utils/responsive";

const ProfileScreen = () => {
  const { user, logout, refreshUser, initializing } = useAuth();
  const {
    configured: agentConfigured,
    agentName,
    avatarSource,
    behavior,
    syncError,
    openSetup,
  } = useAgent();
  const [refreshing, setRefreshing] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;

  const { theme, currentTheme, overrideTheme } = useThemeMode();
  const { fontSize, fontWeight, mode, setMode } = useTypography();

  const headerStyles = createReusableHeaderStyles(theme);
  const styles = createProfileStyles(theme);

  const router = useRouter();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const openLogoutDialog = () => setConfirmVisible(true);
  const closeLogoutDialog = () => setConfirmVisible(false);

  const handleLogout = async () => {
    setConfirmVisible(false);
    await logout();
    router.navigate("/(tabs)/loginSignup");
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshUser();
      if (!cancelled) setRefreshing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const loading = initializing || refreshing;

  if (loading || !user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const first = user.firstName || "";
  const last = user.lastName || "";
  const displayName = (first + " " + last).trim() || "No name set";

  const email = user.email;
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "";

  const behaviorCount = Object.keys(behavior).length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ReusableAnimatedHeader
        scrollY={scrollY}
        title="Profile"
        styles={headerStyles}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.text,
                fontSize: fontSize(22),
                fontWeight: fontWeight(),
              },
            ]}
          >
            Account Info
          </Text>

          <LabelValue
            label="Name"
            value={displayName}
            theme={theme}
            fontSize={fontSize}
            fontWeight={fontWeight}
          />

          <LabelValue
            label="Email"
            value={email}
            theme={theme}
            fontSize={fontSize}
            fontWeight={fontWeight}
          />

          <LabelValue
            label="Account Created"
            value={createdAt}
            theme={theme}
            fontSize={fontSize}
            fontWeight={fontWeight}
          />
        </View>

        <View style={styles.card}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.text,
                fontSize: fontSize(22),
                fontWeight: fontWeight(),
              },
            ]}
          >
            AI Agent
          </Text>

          <View style={styles.agentRow}>
            <View style={styles.agentAvatar}>
              {avatarSource ? (
                <Image
                  source={avatarSource}
                  style={styles.agentAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="message-circle" size={scale(26)} color={theme.textMuted} />
              )}
            </View>

            <View style={styles.agentInfo}>
              <Text
                style={{
                  color: theme.text,
                  fontSize: fontSize(18),
                  fontWeight: fontWeight(),
                }}
              >
                {agentConfigured ? agentName : "Not configured"}
              </Text>

              <Text
                style={{
                  color: theme.text,
                  opacity: 0.6,
                  marginTop: 3,
                  fontSize: fontSize(13),
                }}
              >
                {agentConfigured
                  ? `${behaviorCount} preference${
                      behaviorCount === 1 ? "" : "s"
                    } saved`
                  : "Personalize how your AI looks and behaves"}
              </Text>
            </View>
          </View>

          {syncError && (
            <Text
              style={{
                color: theme.danger,
                marginTop: 12,
                fontSize: fontSize(12.5),
              }}
            >
              {syncError}
            </Text>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.agentButton}
            onPress={openSetup}
          >
            <Feather
              name={agentConfigured ? "edit-2" : "plus"}
              size={scale(18)}
              color={theme.onPrimary}
            />
            <Text
              style={{
                color: theme.onPrimary,
                marginLeft: 8,
                fontWeight: "600",
              }}
            >
              {agentConfigured ? "Update Agent" : "Set Up Agent"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.text,
                fontSize: fontSize(22),
                fontWeight: fontWeight(),
              },
            ]}
          >
            Settings
          </Text>

          <Text style={{ color: theme.text, marginTop: 10 }}>
            Theme: {currentTheme}
          </Text>

          <View style={styles.row}>
            <SettingButton
              label="Light"
              active={currentTheme === "light"}
              onPress={() => overrideTheme("light")}
              styles={styles}
            />
            <SettingButton
              label="Dark"
              active={currentTheme === "dark"}
              onPress={() => overrideTheme("dark")}
              styles={styles}
            />
            <SettingButton
              label="System"
              active={currentTheme === "system"}
              onPress={() => overrideTheme("system")}
              styles={styles}
            />
          </View>

          <Text style={{ color: theme.text, marginTop: 20 }}>Text Style</Text>

          <View style={styles.row}>
            <SettingButton
              label="Default"
              active={mode === "default"}
              onPress={() => setMode("default")}
              styles={styles}
            />
            <SettingButton
              label="Bold"
              active={mode === "bold"}
              onPress={() => setMode("bold")}
              styles={styles}
            />
            <SettingButton
              label="Large"
              active={mode === "large"}
              onPress={() => setMode("large")}
              styles={styles}
            />
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={openLogoutDialog}
            style={[styles.logoutButton, { backgroundColor: theme.primary }]}
          >
            <MaterialIcons name="logout" size={22} color={theme.onPrimary} />
            <Text style={{ color: theme.onPrimary, marginLeft: 8 }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {confirmVisible && (
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmBox}>
              <Text
                style={{
                  color: theme.text,
                  fontSize: fontSize(18),
                  fontWeight: fontWeight(),
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Are you sure you want to logout?
              </Text>

              <View style={styles.confirmRow}>
                <TouchableOpacity
                  onPress={closeLogoutDialog}
                  style={[
                    styles.confirmButton,
                    { backgroundColor: theme.card },
                  ]}
                >
                  <Text style={{ color: theme.text }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  style={[
                    styles.confirmButton,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={{ color: theme.onPrimary }}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Animated.ScrollView>

      <BottomBar />
    </View>
  );
};

const LabelValue = ({ label, value, theme, fontSize, fontWeight }: any) => (
  <>
    <Text
      style={{
        color: theme.text,
        opacity: 0.6,
        marginTop: 12,
        fontSize: fontSize(14),
        fontWeight: fontWeight(),
      }}
    >
      {label}
    </Text>

    <Text
      style={{
        color: theme.text,
        fontSize: fontSize(18),
        fontWeight: fontWeight(),
      }}
    >
      {value}
    </Text>
  </>
);

const SettingButton = ({ label, active, onPress, styles }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.settingButton, active && styles.settingButtonActive]}
  >
    <Text style={[styles.settingButtonText, active && styles.settingButtonTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export default ProfileScreen;
