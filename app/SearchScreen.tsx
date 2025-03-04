import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SearchScreen() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

        // Filtrer les résultats en fonction de la recherche
        const handleSearch = (text) => {
          setSearch(text);
          if (text.length > 0) {
            const filteredResults = allResults.filter((item) =>
              item.name.toLowerCase().includes(text.toLowerCase())
            );
            setResults(filteredResults);
          } else {
            setResults([]);
          }
        };
    
        const handleSelectDestination = (destination) => {
            router.push({
              pathname: "/TrajetScreen",
              params: { departure: "Ma Position", arrival: destination.name },
            });
          };
  
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
            onChangeText={handleSearch}
          />
        </View>

  
        {/* Option "Ma position" */}
        <View style={styles.currentLocation}>
          <Ionicons name="location-sharp" size={20} color="#4894FE" />
          <Text style={styles.currentLocationText}>Ma position</Text>
        </View>

        <View style={styles.separator} />

  
        {/* Liste des résultats */}
        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Adresses</Text>
            
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectDestination(item)}
              >
                <View>
                <Text style={styles.resultText}>{item.name}</Text>
                <Text style={styles.resultSubText}>{item.city}</Text>
                </View>
              </TouchableOpacity>
              )}
            />
          </View>
        )}
        <View style={styles.menu}>
          <Image
          source={require("../assets/images/home.png")}
          style={styles.icone}
          />
           <Image
          source={require("../assets/images/commute.png")}
          style={styles.icone2}
          />
              <Image
          source={require("../assets/images/message.png")}
          style={styles.icone2}
          />
              <Image
          source={require("../assets/images/Frame 3.png")}
          />

        </View>
      </View>

      
    );
  }
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: "absolute",
    top: 60,
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
  separator: {
    height: 1, 
    backgroundColor: "#E0E0E0", 
    marginVertical: 10, 
  },
});
