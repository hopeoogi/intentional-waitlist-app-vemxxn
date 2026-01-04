
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
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const router = useRouter();

  useEffect(() => {
    fadeAnim.value = withDelay(200, withSpring(1));
    slideAnim.value = withDelay(200, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
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
            
            <Text style={styles.description}>
              Join our exclusive community of Intentional connections. No likes or swipes anymore, no more being ghosted, only genuine relationships.
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
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  description: {
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
