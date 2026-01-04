
import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

const { width } = Dimensions.get("window");

const LOOKING_FOR_OPTIONS = [
  "Long-term relationship",
  "Marriage",
  "Life partner",
  "Serious dating",
  "Meaningful connection",
  "Companionship",
  "Deep conversations",
  "Shared values",
  "Emotional intimacy",
  "Building a future together",
  "Authentic connection",
  "Genuine partnership",
];

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

export default function ApplicationScreen() {
  const router = useRouter();
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

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      newErrors.age = "Must be 18 or older";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.provinceState.trim()) {
      newErrors.provinceState = "Province/State is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.lookingFor.length === 0) {
      newErrors.lookingFor = "Please select at least one option";
    } else if (formData.lookingFor.length > 3) {
      newErrors.lookingFor = "Please select up to 3 options";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    console.log("Submitting application:", formData);
    setIsSubmitting(true);

    try {
      // Import API utility at the top of the file
      const { apiPost } = await import("@/utils/api");

      // Prepare the request body according to API schema
      const requestBody = {
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

      console.log("[Application] Submitting to backend:", requestBody);

      // Submit to backend API
      const response = await apiPost<{
        success: boolean;
        message: string;
        id: string;
      }>("/api/waitlist/apply", requestBody);

      console.log("[Application] Success:", response);

      // Navigate to confirmation on success
      router.push("/confirmation");
    } catch (error) {
      console.error("[Application] Submission error:", error);
      Alert.alert(
        "Submission Error",
        "Failed to submit your application. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLookingFor = (option: string) => {
    setFormData((prev) => {
      const current = prev.lookingFor;
      if (current.includes(option)) {
        return { ...prev, lookingFor: current.filter((o) => o !== option) };
      } else if (current.length < 3) {
        return { ...prev, lookingFor: [...current, option] };
      }
      return prev;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Join the Waitlist</Text>
            <Text style={styles.headerSubtitle}>
              Tell us about yourself and what you&apos;re looking for
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                First Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, firstName: text }))
                }
                placeholder="Enter your first name"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, lastName: text }))
                }
                placeholder="Enter your last name"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                value={formData.age}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, age: text }))
                }
                placeholder="Enter your age"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={formData.city}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, city: text }))
                }
                placeholder="Enter your city"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* Province/State */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Province/State <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.provinceState && styles.inputError,
                ]}
                value={formData.provinceState}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, provinceState: text }))
                }
                placeholder="Enter your province or state"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.provinceState && (
                <Text style={styles.errorText}>{errors.provinceState}</Text>
              )}
            </View>

            {/* Country */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Country <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.country && styles.inputError]}
                value={formData.country}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, country: text }))
                }
                placeholder="Enter your country"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.country && (
                <Text style={styles.errorText}>{errors.country}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone Number (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            {/* What are you looking for? */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                What are you looking for? <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.helperText}>
                Select up to 3 options ({formData.lookingFor.length}/3 selected)
              </Text>
              <View style={styles.optionsGrid}>
                {LOOKING_FOR_OPTIONS.map((option, index) => {
                  const isSelected = formData.lookingFor.includes(option);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionChip,
                        isSelected && styles.optionChipSelected,
                      ]}
                      onPress={() => toggleLookingFor(option)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                      {isSelected && (
                        <IconSymbol
                          ios_icon_name="checkmark.circle.fill"
                          android_material_icon_name="check-circle"
                          size={18}
                          color={colors.text}
                          style={styles.checkIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.lookingFor && (
                <Text style={styles.errorText}>{errors.lookingFor}</Text>
              )}
            </View>

            {/* Additional Information (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Information (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.additionalInfo}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, additionalInfo: text }))
                }
                placeholder="Tell us more about yourself..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <View style={styles.submitLoadingContainer}>
                    <ActivityIndicator color={colors.text} size="small" />
                    <Text style={styles.submitText}>Submitting...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitText}>Submit Application</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: Platform.OS === "android" ? 24 : 16,
    paddingBottom: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  required: {
    color: colors.accent,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  optionChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.text,
    fontWeight: "500",
  },
  checkIcon: {
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  submitLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: 1,
  },
});
