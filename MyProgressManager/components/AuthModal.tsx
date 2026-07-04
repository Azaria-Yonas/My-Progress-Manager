import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useThemeMode } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthProvider";
import { ApiError } from "../services/api";

import { createAuthModalStyles } from "../styles/AuthModalStyles";

type AuthModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const router = useRouter();
  const { theme, currentTheme } = useThemeMode();
  const { login, signup } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const switchMode = (next: "login" | "signup" | "reset" | "sent") => {
    setFormError(null);
    setMode(next);
  };

  const handleLogin = async () => {
    if (submitting) return;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setFormError("Enter your email and password.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      await login({ email: trimmedEmail, password: trimmedPassword });
      onClose();
      router.replace("/(tabs)/home");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not log in. Try again.";
      Alert.alert("Login failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (submitting) return;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    if (
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      setFormError("Fill in all fields to create an account.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      await signup({
        email: trimmedEmail,
        password: trimmedPassword,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
      });
      onClose();
      router.replace("/(tabs)/home");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not create account. Try again.";
      Alert.alert("Sign up failed", message);
    } finally {
      setSubmitting(false);
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
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                onChangeText={setPassword}
              />

              {formError && (
                <Text style={[styles.link, { color: theme.danger }]}>
                  {formError}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.button, submitting && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={theme.onPrimary} />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => switchMode("signup")}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => switchMode("reset")}>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            </>
          )}

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
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={setEmail}
              />

              <TextInput
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={isDark ? "#ccc" : "#777"}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                onChangeText={setPassword}
              />

              {formError && (
                <Text style={[styles.link, { color: theme.danger }]}>
                  {formError}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.button, submitting && { opacity: 0.6 }]}
                onPress={handleSignup}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={theme.onPrimary} />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => switchMode("login")}>
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
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={setEmail}
              />

              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => switchMode("login")}>
                <Text style={styles.link}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}

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

              <TouchableOpacity onPress={() => switchMode("login")}>
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
