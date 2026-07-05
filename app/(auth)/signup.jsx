import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await signup({ name, email, password });
      router.back();
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}
    >
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}
          className="w-9 h-9 rounded-full items-center justify-center"
        >
          <ChevronLeft size={17} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View className="px-6 mt-4">
        <View style={{ backgroundColor: colors.navy }} className="w-14 h-14 rounded-[18px] items-center justify-center mb-6">
          <Text style={{ color: colors.gold }} className="text-[20px] font-bold">S</Text>
        </View>
        <Text style={{ color: colors.textPrimary }} className="text-[22px] font-bold">Create your account</Text>
        <Text style={{ color: colors.textMuted }} className="text-[13.5px] mt-1.5">
          Join the community — save reminders and react to the Pastor's posts.
        </Text>

        {error ? (
          <View className="mt-5 bg-[#FEE2E2] rounded-2xl p-3.5">
            <Text className="text-[#991B1B] text-[12.5px]">{error}</Text>
          </View>
        ) : null}

        <View
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="mt-6 flex-row items-center rounded-2xl px-4 py-3.5"
        >
          <UserIcon size={16} color={colors.textMuted} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={colors.textMuted}
            style={{ color: colors.textPrimary }}
            className="flex-1 ml-3 text-[14.5px]"
          />
        </View>

        <View
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="mt-3 flex-row items-center rounded-2xl px-4 py-3.5"
        >
          <Mail size={16} color={colors.textMuted} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ color: colors.textPrimary }}
            className="flex-1 ml-3 text-[14.5px]"
          />
        </View>

        <View
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="mt-3 flex-row items-center rounded-2xl px-4 py-3.5"
        >
          <Lock size={16} color={colors.textMuted} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            style={{ color: colors.textPrimary }}
            className="flex-1 ml-3 text-[14.5px]"
          />
          <Pressable onPress={() => setShowPassword((v) => !v)}>
            {showPassword ? (
              <EyeOff size={16} color={colors.textMuted} />
            ) : (
              <Eye size={16} color={colors.textMuted} />
            )}
          </Pressable>
        </View>

        <View
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          className="mt-3 flex-row items-center rounded-2xl px-4 py-3.5"
        >
          <Lock size={16} color={colors.textMuted} />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            style={{ color: colors.textPrimary }}
            className="flex-1 ml-3 text-[14.5px]"
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={{ backgroundColor: colors.navy, opacity: submitting ? 0.7 : 1 }}
          className="mt-6 rounded-2xl py-4 items-center active:opacity-90"
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-white text-[14px] font-semibold">Create Account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/login")} className="mt-5 items-center">
          <Text style={{ color: colors.textMuted }} className="text-[13px]">
            Already have an account? <Text style={{ color: colors.gold, fontWeight: "600" }}>Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
