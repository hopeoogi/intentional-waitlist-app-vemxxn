
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
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
import { colors } from "@/styles/commonStyles";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);

  useEffect(() => {
    // Animate title entrance
    titleOpacity.value = withDelay(500, withSpring(1, { damping: 15 }));
    titleScale.value = withDelay(
      500,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Auto-navigate to sign-in after 3 seconds
    const timer = setTimeout(() => {
      router.push("/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ scale: titleScale.value }],
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
          colors={["rgba(26, 22, 37, 0.7)", "rgba(26, 22, 37, 0.9)"]}
          style={styles.gradient}
        >
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <Text style={styles.title}>Intentional</Text>
            <View style={styles.underline} />
          </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 64,
    fontWeight: "300",
    color: colors.text,
    letterSpacing: 4,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
  },
  underline: {
    width: 120,
    height: 2,
    backgroundColor: colors.accent,
    marginTop: 16,
    borderRadius: 1,
  },
});
