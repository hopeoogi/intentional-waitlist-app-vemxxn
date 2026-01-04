
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
  "Casual dating",
  "New experiences",
  "Travel companion",
  "Activity partner",
  "Intellectual connection",
  "Spiritual connection",
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
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
    if (Number(formData.age) < 18) {
      Alert.alert("Error", "You must be at least 18 years old");
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
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (formData.lookingFor.length === 0) {
      Alert.alert("Error", "Please select at least one option for what you're looking for");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log("Submit button pressed");
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setLoading(true);
    console.log("Starting API call...");

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: Number(formData.age),
        city: formData.city,
        province_state: formData.provinceState,
        country: formData.country,
        email: formData.email,
        phone_number: formData.phoneNumber || undefined,
        looking_for: formData.lookingFor,
        additional_information: formData.additionalInfo || undefined,
      };

      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await apiPost("/api/waitlist/apply", payload);
      
      console.log("API Response:", response);
      
      Alert.alert("Success", "Your application has been submitted!");
      router.push("/confirmation");
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
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
        Alert.alert("Limit Reached", "You can select up to 3 options");
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Join the Waitlist</Text>
              <Text style={styles.subtitle}>
                Tell us about yourself to get started
              </Text>

              {/* First Name */}
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

              {/* Last Name */}
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

              {/* Age */}
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) =>
                  setFormData({ ...formData, age: text })
                }
                placeholder="Enter your age"
                placeholderTextColor="#888"
                keyboardType="number-pad"
              />

              {/* City */}
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                placeholder="Enter your city"
                placeholderTextColor="#888"
              />

              {/* Province/State */}
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

              {/* Country */}
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

              {/* Email */}
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

              {/* Phone Number */}
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

              {/* What are you looking for */}
              <Text style={styles.label}>
                What are you looking for? * (Select up to 3)
              </Text>
              <View style={styles.optionsContainer}>
                {LOOKING_FOR_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={index}
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

              {/* Additional Information */}
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

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: "#2a2a3e",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#2a2a3e",
  },
  optionButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  optionText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  optionTextSelected: {
    color: "#000000",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 18,
    marginTop: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
});
