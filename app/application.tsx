
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { apiPost } from "@/utils/api";

const LOOKING_FOR_OPTIONS = [
  "Long-term relationship", "Marriage", "Life partner", "Serious dating",
  "Meaningful connection", "Friendship first", "Casual dating", "New experiences",
  "Travel companion", "Activity partner", "Intellectual connection", "Spiritual connection"
];

export default function ApplicationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", age: "", city: "", provinceState: "", country: "",
    email: "", phoneNumber: "", lookingFor: [] as string[], additionalInfo: ""
  });

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.city || 
        !formData.provinceState || !formData.country || !formData.email || formData.lookingFor.length === 0) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }
    if (formData.lookingFor.length > 3) {
      Alert.alert("Error", "Please select up to 3 options for 'What are you looking for?'");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      Alert.alert("Error", "Please enter a valid age (18-120)");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log("[Application] Starting form submission...");
    
    if (!validateForm()) {
      console.log("[Application] Form validation failed");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: parseInt(formData.age),
        city: formData.city,
        province_state: formData.provinceState,
        country: formData.country,
        email: formData.email,
        phone_number: formData.phoneNumber || undefined,
        looking_for: formData.lookingFor,
        additional_information: formData.additionalInfo || undefined,
      };

      console.log("[Application] Submitting payload:", JSON.stringify(payload, null, 2));
      const response = await apiPost("/api/waitlist/apply", payload);
      console.log("[Application] Received response:", JSON.stringify(response, null, 2));

      // Check for success - backend returns { success: true, application: {...} }
      if (response && (response.success === true || response.application)) {
        console.log("[Application] Submission successful! Navigating to confirmation...");
        router.push("/confirmation");
      } else {
        console.error("[Application] Unexpected response format:", response);
        Alert.alert("Error", "Failed to submit application. Please try again.");
      }
    } catch (error: any) {
      console.error("[Application] Submit error:", error);
      console.error("[Application] Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        if (error.message.includes("Network request failed")) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes("400")) {
          errorMessage = "Invalid form data. Please check your entries.";
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      console.log("[Application] Form submission complete");
    }
  };

  const toggleLookingFor = (option: string) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(option)
        ? prev.lookingFor.filter(o => o !== option)
        : prev.lookingFor.length < 3 ? [...prev.lookingFor, option] : prev.lookingFor
    }));
  };

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Join the Waitlist</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="First Name *" 
              placeholderTextColor="#999"
              value={formData.firstName} 
              onChangeText={text => setFormData({...formData, firstName: text})}
              autoCapitalize="words"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Last Name *" 
              placeholderTextColor="#999"
              value={formData.lastName} 
              onChangeText={text => setFormData({...formData, lastName: text})}
              autoCapitalize="words"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Age *" 
              placeholderTextColor="#999" 
              keyboardType="numeric"
              value={formData.age} 
              onChangeText={text => setFormData({...formData, age: text})}
            />
            <TextInput 
              style={styles.input} 
              placeholder="City *" 
              placeholderTextColor="#999"
              value={formData.city} 
              onChangeText={text => setFormData({...formData, city: text})}
              autoCapitalize="words"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Province/State *" 
              placeholderTextColor="#999"
              value={formData.provinceState} 
              onChangeText={text => setFormData({...formData, provinceState: text})}
              autoCapitalize="words"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Country *" 
              placeholderTextColor="#999"
              value={formData.country} 
              onChangeText={text => setFormData({...formData, country: text})}
              autoCapitalize="words"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Email *" 
              placeholderTextColor="#999" 
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={formData.email} 
              onChangeText={text => setFormData({...formData, email: text})}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number (Optional)" 
              placeholderTextColor="#999" 
              keyboardType="phone-pad"
              value={formData.phoneNumber} 
              onChangeText={text => setFormData({...formData, phoneNumber: text})}
            />

            <Text style={styles.label}>What are you looking for? (Select up to 3) *</Text>
            <View style={styles.optionsContainer}>
              {LOOKING_FOR_OPTIONS.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.option, formData.lookingFor.includes(option) && styles.optionSelected]}
                  onPress={() => toggleLookingFor(option)}
                >
                  <Text style={[styles.optionText, formData.lookingFor.includes(option) && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Additional Information (Optional)" 
              placeholderTextColor="#999"
              multiline 
              numberOfLines={4} 
              value={formData.additionalInfo} 
              onChangeText={text => setFormData({...formData, additionalInfo: text})}
              textAlignVertical="top"
            />

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
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
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: "700", color: "#fff", marginBottom: 24, textAlign: "center" },
  input: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: "#000" },
  textArea: { height: 100, textAlignVertical: "top" },
  label: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 12 },
  optionsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  option: { backgroundColor: "#2a2a3e", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, margin: 4 },
  optionSelected: { backgroundColor: "#4a90e2" },
  optionText: { color: "#fff", fontSize: 14 },
  optionTextSelected: { fontWeight: "600" },
  submitButton: { backgroundColor: "#4a90e2", borderRadius: 30, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
