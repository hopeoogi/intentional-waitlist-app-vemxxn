
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(300, withSpring(1));
    translateY.value = withDelay(300, withSpring(0));
    
    // Auto-navigate to signin after 2 seconds
    const timer = setTimeout(() => {
      router.push("/signin");
    }, 2000);
    
    return () => clearTimeout(timer);
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
      <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <Text style={styles.title}>Intentional</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width, height },
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { alignItems: "center" },
  title: { fontSize: 56, fontWeight: "700", color: "#fff", letterSpacing: 1 },
});
