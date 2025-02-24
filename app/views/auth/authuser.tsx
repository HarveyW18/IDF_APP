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
} from "react-native";
import { observer } from "mobx-react-lite";
import { useAuthViewModel } from "../../viewmodels/authViewModel";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Obtenir les dimensions de l'écran
const { width, height } = Dimensions.get("window");

const Auth = observer(() => {
  const {
    isConnexionSelected,
    isNextStep,
    toggleConnexion,
    toggleNextStep,
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
  const confirmPasswordRef = useRef<TextInput>(null);

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
              source={require("../../../assets/images/image1.png")}
              style={styles.image}
            />
            <View style={styles.imageOverlay} />
          </View>

          <View style={styles.formContainer}>
            {/* Switch entre Connexion et Inscription */}
            <View style={styles.switchContainer}>
              <TouchableOpacity onPress={() => toggleConnexion(true)}>
                <Text
                  style={[
                    styles.switchText,
                    isConnexionSelected && styles.activeSwitchText,
                  ]}
                >
                  Connexion
                </Text>
                {/* Ligne active sous le bouton sélectionné */}
                {isConnexionSelected && <View style={styles.activeLine} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleConnexion(false)}>
                <Text
                  style={[
                    styles.switchText,
                    !isConnexionSelected && styles.activeSwitchText,
                  ]}
                >
                  Inscription
                </Text>
                {/* Ligne active sous le bouton sélectionné */}
                {!isConnexionSelected && <View style={styles.activeLine} />}
              </TouchableOpacity>
            </View>

            {/* Formulaires */}
            {isConnexionSelected ? (
              <SafeAreaView style={styles.formArea}>
                {/* Connexion */}
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="envelope"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
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
                  <FontAwesome
                    name="lock"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
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

                <Text style={styles.footerText}>
                  <Text style={styles.linkText}>Mot de passe oublié ?</Text>
                </Text>
                {error && <Text style={styles.error}>{error}</Text>}
              </SafeAreaView>
            ) : (
              <SafeAreaView style={styles.formArea}>
                {/* Inscription */}
                {!isNextStep ? (
                  <>
                    <View style={styles.inputContainer}>
                      <FontAwesome name="user" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        placeholderTextColor={"#444"}
                        value={inputs.lastName}
                        onChangeText={(text) => updateInput("lastName", text)}
                        onSubmitEditing={() => firstNameRef.current?.focus()}
                      />
                    </View>
                    {errors?.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

                    <View style={styles.inputContainer}>
                      <FontAwesome name="user" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        placeholderTextColor={"#444"}
                        ref={firstNameRef}
                        value={inputs.firstName}
                        onChangeText={(text) => updateInput("firstName", text)}
                        onSubmitEditing={() => addressRef.current?.focus()}
                      />
                    </View>
                    {errors?.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

                    <View style={styles.inputContainer}>
                      <FontAwesome name="map-marker" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Adresse"
                        placeholderTextColor={"#444"}
                        ref={addressRef}
                        value={inputs.address}
                        onChangeText={(text) => updateInput("address", text)}
                        onSubmitEditing={() => phoneRef.current?.focus()}
                      />
                    </View>
                    {errors?.address && <Text style={styles.error}>{errors.address}</Text>}

                    <View style={styles.inputContainer}>
                      <FontAwesome name="phone" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Numéro de téléphone"
                        placeholderTextColor={"#444"}
                        ref={phoneRef}
                        keyboardType="numeric"
                        value={inputs.phone}
                        onChangeText={(text) => updateInput("phone", text)}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                    {errors?.phone && <Text style={styles.error}>{errors.phone}</Text>}

                    <TouchableOpacity
                      style={[styles.button, isNextStepDisabled && styles.disabledButton]}
                      onPress={toggleNextStep}
                      disabled={isNextStepDisabled}
                    >
                      <Text style={styles.buttonText}>Suivant</Text>
                    </TouchableOpacity>

                  </>
                ) : (
                  <>
                    <View style={styles.inputContainer}>
                      <FontAwesome name="envelope" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={"#444"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={inputs.email}
                        onChangeText={(text) => updateInput("email", text)}
                        onSubmitEditing={() => passwordRef.current?.focus()}
                      />
                    </View>
                    {errors?.email && <Text style={styles.error}>{errors.email}</Text>}

                    <View style={styles.inputContainer}>
                      <FontAwesome name="lock" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor={"#444"}
                        ref={passwordRef}
                        secureTextEntry
                        value={inputs.password}
                        onChangeText={(text) => updateInput("password", text)}
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                      />
                    </View>
                    {errors?.password && <Text style={styles.error}>{errors.password}</Text>}

                    <View style={styles.inputContainer}>
                      <FontAwesome name="lock" size={width * 0.05} color="#8696BB" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor={"#444"}
                        ref={confirmPasswordRef}
                        secureTextEntry
                        value={inputs.confirmpassword}
                        onChangeText={(text) => updateInput("confirmpassword", text)}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                    {errors?.confirmpassword && <Text style={styles.error}>{errors.confirmpassword}</Text>}

                    <TouchableOpacity
                      style={[styles.button, (isRegisterDisabled || loading) && styles.disabledButton]}
                      onPress={handleRegister}
                      disabled={isRegisterDisabled || loading}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Chargement..." : "Valider"}
                      </Text>
                    </TouchableOpacity>


                    {error && <Text style={styles.error}>{error}</Text>}
                  </>
                )}
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
    marginTop: height * 0.02,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: width * 0.03,
    margin: height * 0.015,
    padding: width * 0.025,
    width: "70%",
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
  button: {
    backgroundColor: "#4894FE",
    margin: height * 0.015,
    borderRadius: width * 0.03,
    padding: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    width: "65%",
    height: height * 0.055,
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

export default Auth;
