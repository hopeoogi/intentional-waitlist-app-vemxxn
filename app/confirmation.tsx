
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
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const router = useRouter();

  useEffect(() => {
    fadeAnim.value = withDelay(200, withSpring(1));
    scaleAnim.value = withDelay(200, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  return (
    <ImageBackground
      source={require("@/assets/images/e1226bff-6dd4-4e54-9d6d-d117c560edab.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <Image
              source={require("@/assets/images/677320a7-e086-48ce-9958-b00cffc6ca94.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
            </View>

            <Text style={styles.message}>
              Thank you for joining our waitlist! We review all applications and when you are approved we will contact you!
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/signin")}
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
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  checkmark: {
    fontSize: 50,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  message: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
