
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
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
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.5);
  const router = useRouter();

  useEffect(() => {
    fadeAnim.value = withDelay(200, withSpring(1));
    scaleAnim.value = withDelay(
      200,
      withSequence(withSpring(1.1), withSpring(1))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Animated.View style={[styles.card, animatedStyle]}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require("@/assets/images/natively-dark.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Success Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>

              {/* Message */}
              <Text style={styles.title}>Thank You!</Text>
              <Text style={styles.message}>
                Thank you for joining our waitlist! We review all applications
                and when you are approved we will contact you!
              </Text>

              {/* Back Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/signin")}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    width: width - 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
