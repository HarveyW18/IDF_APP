import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
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


export default function Itinéraires() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
  
    // Liste complète des lieux
    const allResults = [
      { id: "1", name: "Gare du Nord", city: "75010 Paris, France" },
      { id: "2", name: "Gare de Lyon", city: "75012 Paris, France" },
      { id: "3", name: "Gare Saint-Lazare", city: "75008 Paris, France" },
      { id: "4", name: "Aéroport d'Orly", city: "94310 Orly, France" },
      { id: "5", name: "Aéroport de Madrid", city: "Madrid, Espagne" },
    ];
  

  
    return (
      <View style={styles.container}>
        {/* Bouton de fermeture */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
  
        {/* Titre */}
        <Text style={styles.title}>Arrivée</Text>
  
        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Rechercher une adresse"
            value={search}
          />
        </View>
  
        {/* Option "Ma position" */}
        <View style={styles.currentLocation}>
          <Ionicons name="location-sharp" size={20} color="#4894FE" />
          <Text style={styles.currentLocationText}>Ma position</Text>
        </View>
        </View>

        
      
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    closeButton: {
      position: "absolute",
      top: 50,
      left: 20,
      zIndex: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      paddingHorizontal: 15,
      marginTop: 20,
      height: 50,
    },
    searchIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
    },
    currentLocation: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
    },
    currentLocationText: {
      fontSize: 16,
      marginLeft: 10,
    },
    resultsContainer: {
      marginTop: 20,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#989898",
      marginBottom: 10,
    },
    resultItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#EAEAEA",
    },
    resultIcon: {
      width: 25,
      height: 25,
      marginRight: 15,
    },
    resultText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    resultSubText: {
      fontSize: 14,
      color: "#989898",
    },
    menu: {
      position: "absolute", 
      bottom: 30,
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
  });
  