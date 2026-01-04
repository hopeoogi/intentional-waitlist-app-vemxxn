
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { apiPost } from "@/utils/api";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  city: string;
  provinceState: string;
  country: string;
  email: string;
  phoneNumber: string;
  lookingFor: string[];
  additionalInfo: string;
}

const LOOKING_FOR_OPTIONS = [
  "Long-term relationship",
  "Marriage",
  "Life partner",
  "Serious dating",
  "Meaningful connection",
  "Friendship first",
  "Shared values",
  "Emotional intimacy",
  "Commitment",
  "Building a future",
  "Deep conversations",
  "Authentic connection",
];

export default function ApplicationScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [provinceState, setProvinceState] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 18) {
      Alert.alert("Error", "Please enter a valid age (18+)");
      return false;
    }
    if (!city.trim()) {
      Alert.alert("Error", "Please enter your city");
      return false;
    }
    if (!provinceState.trim()) {
      Alert.alert("Error", "Please enter your province/state");
      return false;
    }
    if (!country.trim()) {
      Alert.alert("Error", "Please enter your country");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (lookingFor.length === 0) {
      Alert.alert("Error", "Please select at least one option for what you're looking for");
      return false;
    }
    if (lookingFor.length > 3) {
      Alert.alert("Error", "Please select up to 3 options only");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log("[Application] Submit button pressed");
    
    if (!validateForm()) {
      console.log("[Application] Validation failed");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        age: Number(age),
        city: city,
        province_state: provinceState,
        country: country,
        email: email,
        phone_number: phoneNumber || null,
        looking_for: lookingFor,
        additional_information: additionalInfo || null,
      };

      console.log("[Application] Submitting payload:", payload);

      // TODO: Backend Integration - Submit waitlist application to /api/waitlist/apply
      const response = await apiPost("/api/waitlist/apply", payload);

      console.log("[Application] Response received:", response);

      // Navigate to confirmation screen on success
      // The backend returns { success: true, message: "...", application: {...} }
      if (response && (response.success === true || response.application)) {
        console.log("[Application] Success! Navigating to confirmation...");
        router.push("/confirmation");
      } else {
        console.log("[Application] Unexpected response format:", response);
        Alert.alert("Error", response.message || "Failed to submit application");
      }
    } catch (error: any) {
      console.error("[Application] Error submitting:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else {
      if (lookingFor.length < 3) {
        setLookingFor([...lookingFor, option]);
      } else {
        Alert.alert("Limit Reached", "You can select up to 3 options only");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to get started
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
              />

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
              />

              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#999"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />

              <TextInput
                style={styles.input}
                placeholder="Province/State"
                placeholderTextColor="#999"
                value={provinceState}
                onChangeText={setProvinceState}
              />

              <TextInput
                style={styles.input}
                placeholder="Country"
                placeholderTextColor="#999"
                value={country}
                onChangeText={setCountry}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number (Optional)"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              <Text style={styles.sectionTitle}>
                What are you looking for? (Select up to 3)
              </Text>
              <View style={styles.optionsContainer}>
                {LOOKING_FOR_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      lookingFor.includes(option) && styles.optionButtonSelected,
                    ]}
                    onPress={() => toggleLookingFor(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        lookingFor.includes(option) && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional Information (Optional)"
                placeholderTextColor="#999"
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#000",
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  optionButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#000000",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "700",
  },
});
