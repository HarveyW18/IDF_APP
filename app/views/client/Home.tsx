import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { SearchBar } from 'react-native-elements';


const { width, height } = Dimensions.get("window");

export default function Home() {
  // Gestion de l'état pour le switch Connexion/Inscription
  const [isConnexionSelected, setIsConnexionSelected] = useState(true);
  const [search, setSearch] = useState<string>(""); // ✅ Type explicite

  

  const toggleConnexion = (isConnexion: boolean) => {
    setIsConnexionSelected(isConnexion);
  };

  

  return (
    <SafeAreaView style={{ flex: 1,minHeight: height}}>
      {/* Image de fond avec une superposition */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/images/image3.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
            <Text style={styles.texte}>Bonjour John Doe,</Text>
            <Image source={require("../../../assets/images/Frame.png")} style={styles.profil} />
        </View>

        <TouchableOpacity  style={styles.searchContainer}
        onPress={() => router.push({ pathname: "/SearchScreen" })}
      >
        <Ionicons name="search" size={20} color="#B0B0B0"/>
        <Text style="">Rechercher une adresse</Text>
      </TouchableOpacity>
          <View style={styles.menu}>
          <Image
          source={require("../../../assets/images/home.png")}
          style={styles.icone}
          />
           <Image
          source={require("../../../assets/images/commute.png")}
          style={styles.icone2}
          />
              <Image
          source={require("../../../assets/images/message.png")}
          style={styles.icone2}
          />
              <Image
          source={require("../../../assets/images/Frame 3.png")}
          />

        </View>
      </View>
    </SafeAreaView>
  );
}

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
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.02,
    width: "100%",

  },
  switchContainer: {
    flexDirection: "row",
    marginTop: height * 0.03,
    width: "60%",
    gap: width * 0.05,
  },
texte: {
    fontWeight: 600,
    fontSize: 18,
    marginRight: 150
},
searchContainer: {
    width: "90%",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: height * 0.02,
    flexDirection: "row",

    
  },
  searchInputContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: width * 0.03,
  },
  menu: {
    position: "absolute", 
    bottom: 100,
    left: 20, 
    right: 20, 
    alignItems: "flex-end",
    backgroundColor: "#4894FE",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around", 
  },
  icone: {
    margin: 10
  },
  icone2: {
    margin: 11
  },
  profil: {
    justifyContent: "flex-end",
  },
  headerContainer: {
    flexDirection: "row", 
  alignItems: "center", 
  justifyContent: "space-between", 
  }


});

