import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";

import { supabase } from "../lib/supabaseClient";
import { useThemeMode } from "../context/ThemeContext";
import { useRouter } from "expo-router";

import { createAuthModalStyles } from "../styles/AuthModalStyles";

type AuthModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const router = useRouter();
  const { theme, currentTheme } = useThemeMode();

  const isDark =
    currentTheme === "dark" ||
    (currentTheme === "system" && false); 

  const styles = createAuthModalStyles(theme, isDark);

  const [mode, setMode] = useState<"login" | "signup" | "reset" | "sent">(
    "login"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      onClose();
      router.replace("/(tabs)/home");
    }
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      onClose();
      router.replace("/(tabs)/home");
    }
  };

  const handleReset = async () => {
    setMode("sent");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          {mode === "login" && (
            <>
              <Text style={styles.title}>Login</Text>

              <TextInput
                placeholder="Email"
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMode("signup")}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMode("reset")}>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            </>
          )}

          {/* SIGNUP */}
          {mode === "signup" && (
            <>
              <Text style={styles.title}>Sign Up</Text>

              <TextInput
                placeholder="First Name"
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setFirstName}
              />

              <TextInput
                placeholder="Last Name"
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setLastName}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMode("login")}>
                <Text style={styles.link}>Already have an account? Login</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === "reset" && (
            <>
              <Text style={styles.title}>Reset Password</Text>

              <TextInput
                placeholder="Email"
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                onChangeText={setEmail}
              />

              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMode("login")}>
                <Text style={styles.link}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}

          {/* RESET SENT */}
          {mode === "sent" && (
            <>
              <Text style={styles.title}>Email Sent</Text>

              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  color: theme.text,
                }}
              >
                Check your email for the reset link.
              </Text>

              <TouchableOpacity onPress={() => setMode("login")}>
                <Text style={styles.link}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
