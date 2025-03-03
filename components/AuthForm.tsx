import React, { useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Keyboard,
  Platform
} from "react-native";
import { observer } from "mobx-react-lite";
import { useAuthViewModel } from "../app/viewmodels/authViewModel";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { GOOGLE_API_KEY } from "../app/config"; // 
import { FlatList } from "react-native";


const BASE_AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

interface GooglePlacePrediction {
  place_id: string;
  description: string;
}

// Obtenir les dimensions de l'écran
const { width, height } = Dimensions.get("window");

const AuthForm = observer(() => {
  const {
    role,
    isConnexionSelected,
    isNextStep,
    toggleConnexion,
    toggleNextStep,
    validatePassword,
    handleLogin,
    handleRegister,
    inputs,
    updateInput,
    loading,
    error,
    errors,
    isNextStepDisabled,
    isLoginDisabled,
    isRegisterDisabled
  } = useAuthViewModel();

  // Références pour la navigation entre les champs
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordValidation = validatePassword(inputs.password);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [suggestions, setSuggestions] = useState<{ place_id: string; description: string }[]>([]);
  const [focused, setFocused] = useState<boolean>(false);

  const fetchSuggestions = async (text: string) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    const url = `${BASE_AUTOCOMPLETE_URL}?input=${encodeURIComponent(text)}&key=${GOOGLE_API_KEY}&types=geocode&language=fr`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.predictions) {
        setSuggestions(
          data.predictions.map((item: any) => ({
            place_id: item.place_id,
            description: item.description,
          }))
        );
      }
    } catch (error) {
      console.error("❌ Erreur API Google Places :", error);
    }
  };


  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <KeyboardAwareScrollView
          extraScrollHeight={10}
          enableOnAndroid={true}
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Image de fond avec une superposition */}
          <View style={styles.imageContainer}>
            <Image
              source={role === "agent" ? require("../assets/images/image2.jpg") : require("../assets/images/image1.png")}
              style={styles.image}
            />
            <View style={[styles.imageOverlay, { backgroundColor: role === "agent" ? "rgba(255, 92, 92, 0.6)" : "rgba(72, 148, 254, 0.6)" }]} />
          </View>

          <View style={styles.formContainer}>
            {/* Switch entre Connexion et Inscription */}
            <View style={styles.switchContainer}>
              <TouchableOpacity onPress={() => toggleConnexion(true)}>
                <Text style={[styles.switchText, isConnexionSelected && styles.activeSwitchText]}>Connexion</Text>
                {isConnexionSelected && <View style={styles.activeLine} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleConnexion(false)}>
                <Text style={[styles.switchText, !isConnexionSelected && styles.activeSwitchText]}>Inscription</Text>
                {!isConnexionSelected && <View style={styles.activeLine} />}
              </TouchableOpacity>
            </View>

            {/* Formulaires */}
            {isConnexionSelected ? (
              <SafeAreaView style={styles.formArea}>
                {/* Connexion */}
                <View style={styles.inputContainer}>
                  <FontAwesome name="envelope" size={width * 0.05} color="#8696BB" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="email"
                    placeholderTextColor={"#444"}
                    value={inputs.email}
                    keyboardType="email-address"
                    onChangeText={(text) => updateInput("email", text)}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                <View style={styles.inputContainer}>
                  <FontAwesome name="lock" size={width * 0.05} color="#8696BB" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="mot de passe"
                    ref={passwordRef}
                    placeholderTextColor={"#444"}
                    secureTextEntry
                    value={inputs.password}
                    onChangeText={(text) => updateInput("password", text)}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoginDisabled && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={isLoginDisabled}
                >
                  <Text style={styles.buttonText}>{loading ? "Connexion..." : "Se connecter"}</Text>
                </TouchableOpacity>

                {error && <Text style={styles.error}>{error}</Text>}
              </SafeAreaView>
            ) : (
              <SafeAreaView style={styles.formArea}>
                {/* Inscription */}
                {!isNextStep ? (
                  <>
                    {/* Étape 1 : Infos personnelles */}
                    <View style={styles.inputContainer}>
                      <FontAwesome name="user" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        placeholderTextColor={"#444"}
                        value={inputs.lastName}
                        onChangeText={(text) => updateInput("lastName", text)}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesome name="user" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        placeholderTextColor={"#444"}
                        value={inputs.firstName}
                        onChangeText={(text) => updateInput("firstName", text)}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesome name="map-marker" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Adresse"
                        placeholderTextColor={"#444"}
                        value={inputs.address}
                        onChangeText={(text) => {
                          updateInput("address", text);
                          fetchSuggestions(text); // 🔥 Appel API Google
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 200)} // Pour éviter de cacher immédiatement
                      />
                    </View>
                    {Array.isArray(suggestions) && suggestions.length > 0 && (
                      <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.place_id}
                        style={styles.suggestionsList}
                        renderItem={({ item }: { item: GooglePlacePrediction }) => (
                          <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => {
                              updateInput("address", item.description);
                              setSuggestions([]); // Cache les suggestions après sélection
                              setFocused(false);
                            }}
                          >
                            <Text style={styles.suggestionText}>{item.description}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    <View style={styles.inputContainer}>
                      <FontAwesome name="phone" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Numéro de téléphone"
                        placeholderTextColor={"#444"}
                        keyboardType="numeric"
                        value={inputs.phone}
                        onChangeText={(text) => {
                          const numericValue = text.replace(/[^0-9]/g, ""); // Supprime tout sauf les chiffres
                          updateInput("phone", numericValue);
                        }}
                      />
                    </View>

                    {/* Bouton "Suivant" pour passer à l'étape 2 */}
                    <TouchableOpacity
                      style={styles.button} // ✅ Retire isNextStepDisabled
                      onPress={toggleNextStep} // 🔥 Vérifie les champs avant de passer à l'étape suivante
                    >
                      <Text style={styles.buttonText}>Suivant</Text>
                    </TouchableOpacity>

                  </>
                ) : (
                  <>
                    {/* Étape 2 : Email et mot de passe */}
                    <View style={styles.inputContainer}>
                      <FontAwesome name="envelope" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={"#444"}
                        keyboardType="email-address"
                        value={inputs.email}
                        onChangeText={(text) => updateInput("email", text)}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesome name="lock" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor={"#444"}
                        secureTextEntry
                        value={inputs.password}
                        onChangeText={(text) => updateInput("password", text)}
                      />
                    </View>
                    {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                    <View style={styles.passwordCriteria}>
                      <Text style={[styles.criterion, passwordValidation.minLength && styles.criterionValid]}>
                            • 8 caractères minimum
                      </Text>
                      <Text style={[styles.criterion, passwordValidation.hasUppercase && styles.criterionValid]}>
                            • 1 majuscule
                      </Text>
                      <Text style={[styles.criterion, passwordValidation.hasSpecialChar && styles.criterionValid]}>
                            • 1 caractère spécial
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesome name="lock" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor={"#444"}
                        secureTextEntry
                        value={inputs.confirmpassword}
                        onChangeText={(text) => updateInput("confirmpassword", text)}
                      />
                    </View>
                    {errors.confirmpassword && <Text style={styles.error}>{errors.confirmpassword}</Text>}
                    {/* Bouton "S'inscrire" */}
                    <TouchableOpacity
                      style={[styles.button, isRegisterDisabled && styles.disabledButton]}
                      onPress={handleRegister}
                      disabled={isRegisterDisabled}
                    >
                      <Text style={styles.buttonText}>{loading ? "Inscription..." : "S'inscrire"}</Text>
                    </TouchableOpacity>
                  </>
                )}

                {error && <Text style={styles.error}>{error}</Text>}
              </SafeAreaView>
            )}
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </>
  );

});

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: height * 0.2,
    overflow: "hidden", // Empêcher les débordements
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(72, 148, 254, 0.6)",
  },
  formContainer: {
    flex: 1.5,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: -height * 0.05,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.03,
    width: "60%",
    gap: width * 0.05,
  },
  switchText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#8696BB",
  },
  activeSwitchText: {
    color: "#4894FE",
  },
  activeLine: {
    height: 2,
    backgroundColor: "#4894FE",
    marginTop: height * 0.005,
    width: "100%",
  },
  formArea: {
    marginTop: height * 0.04,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: width * 0.03,
    margin: height * 0.015,
    padding: width * 0.025,
    width: "75%",
    height: height * 0.065,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.02,
  },
  icon: {
    marginHorizontal: width * 0.04,
  },
  input: {
    flex: 1,
    height: height * 0.035,
    fontSize: width * 0.035,
    fontWeight: "light",

  },
  suggestionsList: {
    backgroundColor: "#FFF",
    borderRadius: width * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.02,
    elevation: 2,
    width: "75%",
    alignSelf: "center",
    marginTop: 2,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  suggestionText: {
    fontSize: width * 0.035,
    color: "#444",
  },
  passwordCriteria: {
    marginTop: 5,
    paddingHorizontal: 50,
  },
  criterion: {
    fontSize: 14,
    color: "#8696BB",
  },
  criterionValid: {
    color: "green", // ✅ Change en vert quand validé
  },  
  button: {
    backgroundColor: "#4894FE",
    margin: height * 0.025,
    borderRadius: width * 0.03,
    padding: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.65,
    height: height * 0.065,
    shadowColor: "#4894FE",
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.05,
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "#B0B0B0", // Couleur grisée pour indiquer le désactivé
    shadowColor: "transparent", // Supprime l'ombre pour un effet désactivé
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "500",
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.0005,
  },
  footerText: {
    color: "#8696BB",
    marginTop: height * 0.03,
    textAlign: "center",
    fontSize: width * 0.03,
  },
  linkText: {
    color: "#4894FE",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: height * 0.01,
  },
});

export default AuthForm;
