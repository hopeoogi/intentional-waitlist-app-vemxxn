
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(200, withSpring(1));
    translateY.value = withDelay(200, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
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
            <Text style={styles.description}>
              Join our exclusive community of Intentional connections. No likes or swipes anymore, no more being ghosted, only genuine relationships.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/application")}>
              <Text style={styles.buttonText}>Join our Community</Text>
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
  description: { fontSize: 16, color: "#fff", textAlign: "center", marginBottom: 40, lineHeight: 24 },
  button: { backgroundColor: "#fff", paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30 },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#000" },
});
