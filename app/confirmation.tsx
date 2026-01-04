
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withSequence } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const router = useRouter();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(200, withSequence(withSpring(1.2), withSpring(1)));
    opacity.value = withDelay(200, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800" }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <Image source={{ uri: "https://via.placeholder.com/120" }} style={styles.logo} />
            <Text style={styles.message}>
              Thank you for joining our waitlist! We review all applications and when you are approved we will contact you!
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/signin")}>
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width, height },
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  content: { alignItems: "center" },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 32 },
  message: { fontSize: 18, color: "#fff", textAlign: "center", marginBottom: 40, lineHeight: 28 },
  button: { backgroundColor: "#fff", paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30 },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#000" },
});
