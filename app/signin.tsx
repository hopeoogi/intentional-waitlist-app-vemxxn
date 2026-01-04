
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
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
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const router = useRouter();

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

            <Text style={styles.description}>
              Join our exclusive community of Intentional connections. No likes
              or swipes anymore, no more being ghosted, only genuine
              relationships.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/application")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Join our Community</Text>
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
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
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
