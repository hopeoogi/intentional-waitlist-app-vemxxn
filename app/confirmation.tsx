
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
  withSequence,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

const { width, height } = Dimensions.get("window");

export default function ConfirmationScreen() {
  const router = useRouter();
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotate = useSharedValue(-180);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    // Animate checkmark
    checkmarkScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      )
    );
    checkmarkRotate.value = withDelay(300, withSpring(0, { damping: 12 }));

    // Animate content
    contentOpacity.value = withDelay(800, withSpring(1));
    contentTranslateY.value = withDelay(800, withSpring(0));
  }, []);

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: checkmarkScale.value },
        { rotate: `${checkmarkRotate.value}deg` },
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
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
            "rgba(26, 22, 37, 0.88)",
            "rgba(26, 22, 37, 0.93)",
            "rgba(26, 22, 37, 0.96)",
          ]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={{
                    uri: "https://prod-finalquest-user-projects-storage-bucket-aws.s3.amazonaws.com/user-projects/279d2210-f350-46be-b3af-b605dbd18c3a/assets/images/ebb0bc4b-69db-4cd2-ba3b-f6f379ffa8d8.png?AWSAccessKeyId=AKIAVRUVRKQJC5DISQ4Q&Signature=qjA2%2BR%2B%2Fi6maJpuZ682EUulNwp4%3D&Expires=1767628940",
                  }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Success Checkmark */}
              <Animated.View
                style={[styles.checkmarkContainer, checkmarkAnimatedStyle]}
              >
                <View style={styles.checkmarkCircle}>
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={48}
                    color={colors.text}
                  />
                </View>
              </Animated.View>

              {/* Message */}
              <Animated.View
                style={[styles.messageContainer, contentAnimatedStyle]}
              >
                <Text style={styles.title}>Thank you for joining our waitlist!</Text>
                <Text style={styles.description}>
                  We review all applications and when you are approved we will
                  contact you!
                </Text>
              </Animated.View>

              {/* Button */}
              <Animated.View style={[styles.buttonContainer, contentAnimatedStyle]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push("/signin")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Back to Home</Text>
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
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  checkmarkContainer: {
    marginBottom: 40,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  messageContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "300",
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
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
