
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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/natively-dark.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[styles.content, animatedStyle]}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require("@/assets/images/natively-dark.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Description */}
              <Text style={styles.description}>
                Join our exclusive community of Intentional connections. No
                likes or swipes anymore, no more being ghosted, only genuine
                relationships.
              </Text>

              {/* Join Button */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
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
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  description: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 50,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        fontFamily: "System",
      },
      android: {
        fontFamily: "sans-serif",
      },
    }),
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontFamily: "System",
      },
      android: {
        fontFamily: "sans-serif-medium",
      },
    }),
  },
});
