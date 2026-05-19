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

MyProgressManager helps you build better habits, stay consistent, and track your progress over time. Whether you're managing daily tasks, personal goals, or long-term streaks, the app provides simple tools to help you stay focused and organized.{"\n"}
Track your routines, monitor your progress, and view insights that help you stay motivated. The Stats page gives you a clear view of your consistency, while streak tracking encourages accountability and long-term growth.{"\n"}
Getting started is simple:{"\n"}
Create an account or sign in{"\n"}
Add tasks, goals, or streaks{"\n"}
Log your progress regularly{"\n"}
View your stats and consistency insights{"\n"}
Build momentum one day at a time{"\n"}
Stay consistent. Stay motivated. Keep progressing.{"\n"}
Terms of Service:{"\n"}
Use MyProgressManager at your own risk. The app is provided "as is" without any warranties. We are not liable for any data loss or issues that may arise. By using the app, you agree to our terms and privacy policy.{"\n"}

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
