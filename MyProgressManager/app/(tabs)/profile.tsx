// app/(tabs)/profile.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from "react-native";

import { useThemeMode } from "../../context/ThemeContext";
import { useTypography } from "../../context/TypographyContext";
import { useAuth } from "../../context/AuthProvider";

import ReusableAnimatedHeader from "../../components/ReusableAnimatedHeader";
import { createReusableHeaderStyles } from "../../styles/ReusableHeaderStyles";
import { createProfileStyles } from "../../styles/ProfileStyles";
import BottomBar from "../../components/BottomBar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const { user, logout, refreshUser, initializing } = useAuth();
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
    router.replace("/(tabs)/loginSignup");
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
            <MaterialIcons name="logout" size={22} color={theme.text} />
            <Text style={{ color: theme.text, marginLeft: 8 }}>Logout</Text>
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
                  <Text style={{ color: theme.text }}>Logout</Text>
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
    <Text style={styles.settingButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default ProfileScreen;
