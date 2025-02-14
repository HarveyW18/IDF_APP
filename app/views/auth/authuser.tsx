import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { observer } from "mobx-react-lite";
import { useAuthViewModel } from "../../viewmodels/authViewModel";
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
  } = useAuthViewModel();

  return (
    <>
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
                value={inputs.email}
                onChangeText={(text) => updateInput("email", text)}
              />
            </View>
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
                secureTextEntry
                value={inputs.password}
                onChangeText={(text) => updateInput("password", text)}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Connexion..." : "Se connecter"}
              </Text>
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
                  <FontAwesome
                    name="user"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="nom"
                    value={inputs.lastName}
                    onChangeText={(text) => updateInput("lastName", text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="user"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="prénom"
                    value={inputs.firstName}
                    onChangeText={(text) => updateInput("firstName", text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="map-marker"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="adresse"
                    value={inputs.address}
                    onChangeText={(text) => updateInput("address", text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="phone"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="numéro de téléphone"
                    value={inputs.phone}
                    onChangeText={(text) => updateInput("phone", text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={toggleNextStep}
                >
                  <Text style={styles.buttonText}>Suivant</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
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
                    value={inputs.email}
                    onChangeText={(text) => updateInput("email", text)}
                  />
                </View>
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
                    secureTextEntry
                    value={inputs.password}
                    onChangeText={(text) => updateInput("password", text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="lock"
                    size={width * 0.05}
                    color="#8696BB"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="confirmer mot de passe"
                    secureTextEntry
                    value={inputs.password}
                    onChangeText={(text) => updateInput("confirmpassword", text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Inscription..." : "Valider"}
                  </Text>
                </TouchableOpacity>
                {error && <Text style={styles.error}>{error}</Text>}
              </>
            )}
          </SafeAreaView>
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
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
    marginTop: -height * 0.02, // Réduire l'écart avec l'image
    shadowColor: "#000",
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.02,
    elevation: 5,
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
