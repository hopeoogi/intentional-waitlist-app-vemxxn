
import React, { useEffect } from "react";
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
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const router = useRouter();
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-30);
  const descriptionOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.9);

  useEffect(() => {
    // Staggered animations
    logoOpacity.value = withDelay(200, withSpring(1));
    logoTranslateY.value = withDelay(200, withSpring(0));
    descriptionOpacity.value = withDelay(600, withSpring(1));
    buttonOpacity.value = withDelay(1000, withSpring(1));
    buttonScale.value = withDelay(1000, withSpring(1));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ translateY: logoTranslateY.value }],
    };
  });

  const descriptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: descriptionOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/279d2210-f350-46be-b3af-b605dbd18c3a/assets/images/086511e3-6332-40be-b62b-6d12808da7a4.jpeg?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=%2BIFoHAM0A0SxHOPFLRjvNgykFxo%3D&Expires=1767628940",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(26, 22, 37, 0.85)",
            "rgba(26, 22, 37, 0.92)",
            "rgba(26, 22, 37, 0.95)",
          ]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              {/* Logo */}
              <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <Image
                  source={{
                    uri: "https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/279d2210-f350-46be-b3af-b605dbd18c3a/assets/images/ebb0bc4b-69db-4cd2-ba3b-f6f379ffa8d8.png?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=qjA2%2BR%2B%2Fi6maJpuZ682EUulNwp4%3D&Expires=1767628940",
                  }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* Description */}
              <Animated.View
                style={[styles.descriptionContainer, descriptionAnimatedStyle]}
              >
                <Text style={styles.description}>
                  Join our exclusive community of Intentional connections. No
                  likes or swipes anymore, no more being ghosted, only genuine
                  relationships.
                </Text>
              </Animated.View>

              {/* Button */}
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push("/application")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Join our Community</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
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
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  descriptionContainer: {
    marginBottom: 60,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  button: {
    width: width - 64,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: 1,
  },
});
