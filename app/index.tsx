
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const router = useRouter();

  useEffect(() => {
    opacity.value = withDelay(300, withSpring(1, { damping: 15 }));
    scale.value = withDelay(300, withSpring(1, { damping: 15 }));

    const timer = setTimeout(() => {
      router.replace("/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <ImageBackground
      source={require("@/assets/images/natively-dark.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.title}>Intentional</Text>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 56,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
