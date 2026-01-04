
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
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
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    provinceState: "",
    country: "",
    email: "",
    phoneNumber: "",
    lookingFor: [],
    additionalInfo: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    console.log("[Application] Validating form...", formData);
    
    if (!formData.firstName.trim()) {
      Alert.alert("Error", "Please enter your first name");
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert("Error", "Please enter your last name");
      return false;
    }
    if (!formData.age.trim() || isNaN(Number(formData.age))) {
      Alert.alert("Error", "Please enter a valid age");
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert("Error", "Please enter your city");
      return false;
    }
    if (!formData.provinceState.trim()) {
      Alert.alert("Error", "Please enter your province/state");
      return false;
    }
    if (!formData.country.trim()) {
      Alert.alert("Error", "Please enter your country");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }
    if (formData.lookingFor.length === 0) {
      Alert.alert("Error", "Please select at least one option for what you're looking for");
      return false;
    }
    if (formData.lookingFor.length > 3) {
      Alert.alert("Error", "Please select up to 3 options only");
      return false;
    }
    
    console.log("[Application] Form validation passed!");
    return true;
  };

  const handleSubmit = async () => {
    console.log("[Application] Submit button pressed!");
    
    if (!validateForm()) {
      console.log("[Application] Validation failed, aborting submit");
      return;
    }

    setIsLoading(true);
    console.log("[Application] Starting API call...");
    
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: Number(formData.age),
        city: formData.city,
        province_state: formData.provinceState,
        country: formData.country,
        email: formData.email,
        phone_number: formData.phoneNumber || null,
        looking_for: formData.lookingFor,
        additional_information: formData.additionalInfo || null,
      };
      
      console.log("[Application] Sending payload:", payload);
      
      const response = await apiPost("/api/waitlist/apply", payload);
      
      console.log("[Application] API response:", response);

      if (response && response.application_id) {
        console.log("[Application] Success! Navigating to confirmation...");
        router.push("/confirmation");
      } else {
        console.error("[Application] No application_id in response:", response);
        Alert.alert("Error", "Failed to submit application. Please try again.");
      }
    } catch (error: any) {
      console.error("[Application] API Error:", error);
      console.error("[Application] Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      Alert.alert(
        "Submission Error", 
        error.message || "An unexpected error occurred. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
      console.log("[Application] Submit process completed");
    }
  };

  const toggleLookingFor = (option: string) => {
    if (formData.lookingFor.includes(option)) {
      setFormData({
        ...formData,
        lookingFor: formData.lookingFor.filter((item) => item !== option),
      });
    } else {
      if (formData.lookingFor.length < 3) {
        setFormData({
          ...formData,
          lookingFor: [...formData.lookingFor, option],
        });
      } else {
        Alert.alert("Limit Reached", "You can select up to 3 options only");
      }
    }
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Join the Waitlist</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself to get started
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                placeholder="Enter your first name"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
                placeholder="Enter your last name"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Enter your age"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                placeholder="Enter your city"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Province/State *</Text>
              <TextInput
                style={styles.input}
                value={formData.provinceState}
                onChangeText={(text) =>
                  setFormData({ ...formData, provinceState: text })
                }
                placeholder="Enter your province or state"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(text) =>
                  setFormData({ ...formData, country: text })
                }
                placeholder="Enter your country"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder="Enter your email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, phoneNumber: text })
                }
                placeholder="Enter your phone number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                What are you looking for? * (Select up to 3)
              </Text>
              <View style={styles.optionsContainer}>
                {LOOKING_FOR_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={`${option}-${index}`}
                    style={[
                      styles.optionButton,
                      formData.lookingFor.includes(option) &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => toggleLookingFor(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        formData.lookingFor.includes(option) &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.additionalInfo}
                onChangeText={(text) =>
                  setFormData({ ...formData, additionalInfo: text })
                }
                placeholder="Tell us more about yourself..."
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#000000",
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#2a2a3e",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  optionButtonSelected: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  optionText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 30,
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
