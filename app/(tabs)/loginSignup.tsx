// app/(tabs)/loginSignup.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useLoading } from "../../context/LoadingContext";
import { useThemeMode } from "../../context/ThemeContext";
import { createLoginSignupStyles } from "../../styles/loginSignup";
import AuthModal from "../../components/AuthModal";

export default function GetStarted() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { setLoading } = useLoading();
  const [authVisible, setAuthVisible] = useState(false);

  const styles = createLoginSignupStyles(theme);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>

        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/images/suitcase.png")}
            style={styles.logoImage}
            resizeMode="center"
          />
        </View>

        <View style={styles.welcomeBox}>
          <View style={styles.welcomeInner}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <ScrollView style={styles.welcomeScroll} showsVerticalScrollIndicator={false}>


              <Text style={styles.introText}>

MyProgressManager helps you stay consistent, build healthy habits, and track your progress in a clear and motivating way. Whether you're managing daily tasks or maintaining long-term streaks, the app gives you simple tools that keep you organized and on track. {"\n"}

Add goals, log your progress, and watch your routines transform over time. Your Stats page breaks down your performance, while streaks help you stay accountable and celebrate consistency with visual reports and daily insights. {"\n"}

Before you begin, please note: {"\n"}
- Do NOT use your real email or real password{"\n"}
- Create a simple login using any made-up email{"\n"}
- Your password can be short and easy{"\n"}
- The email does NOT need to exist in real life{"\n"}
This keeps your information safe while allowing you to explore the app freely.

Getting started is easy:{"\n"}
- Add a task or create a streak{"\n"}
- Log your progress each day or interval{"\n"}
- View your streak history and insights{"\n"}
- Stay consistent and watch your growth build over time{"\n"}

Let’s build your progress—one day at a time.


Terms of Service:{"\n"}
By using MyProgressManager, you agree that this app is for personal productivity and demonstration purposes only. No real personal data should be entered into the app, and all usage is at your discretion.



              </Text>

            </ScrollView>
          </View>
        </View>


        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => setAuthVisible(true)}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <AuthModal visible={authVisible} onClose={() => setAuthVisible(false)} />
    </View>
  );
}
