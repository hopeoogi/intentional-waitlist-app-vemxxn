
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from "react-native-reanimated";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12 }));
    opacity.value = withDelay(200, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ImageBackground
      source={require("@/assets/images/natively-dark.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/final_quest_240x240.png")}
                style={styles.logo}
              />
            </View>

            <View style={styles.checkmarkContainer}>
              <IconSymbol name="checkmark.circle.fill" size={80} color="#4CAF50" />
            </View>

            <Text style={styles.title}>Thank You!</Text>

            <Text style={styles.description}>
              Thank you for joining our waitlist! We review all applications and
              when you are approved we will contact you!
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/signin")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
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
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
