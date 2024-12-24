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

const AuthAgent = observer(() => {
  const {
    handleLogin,
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
          source={require("../../../assets/images/image2.jpg")}
          style={styles.image}
        />
        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.formContainer}>
        {/* Titre Connexion */}
        <Text style={styles.title}>Connexion</Text>

        {/* Formulaire de Connexion */}
        <SafeAreaView style={styles.formArea}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="envelope"
              size={width * 0.05}
              color="#FF5C5C"
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
              color="#FF5C5C"
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
    backgroundColor: "rgba(255, 92, 92, 0.6)",
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
  title: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#FF5C5C",
    marginTop: height * 0.02,
    marginBottom: height * 0.00,
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
    width: "90%",
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
  },
  button: {
    backgroundColor: "#FF5C5C",
    margin: height * 0.015,
    borderRadius: width * 0.03,
    padding: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: height * 0.05,
    shadowColor: "#FF5C5C",
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.05,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "600",
  },
  footerText: {
    color: "#8696BB",
    marginTop: height * 0.03,
    textAlign: "center",
    fontSize: width * 0.03,
  },
  linkText: {
    color: "#FF5C5C",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: height * 0.01,
  },
});

export default AuthAgent;
