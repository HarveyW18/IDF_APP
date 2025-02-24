import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SearchBar from "../../../components/SearchBar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";

const SearchScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "SearchScreen">>();
    
    const [depart, setDepart] = useState("");
    const [arrivee, setArrivee] = useState("");

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}> {/* Ajout du fond blanc */}
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Départ</Text>
            <SearchBar placeholder="Entrez un lieu de départ" onSelect={setDepart} />

            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>Arrivée</Text>
            <SearchBar placeholder="Entrez un lieu d’arrivée" onSelect={setArrivee} />

            <TouchableOpacity
                style={{
                    marginTop: 20,
                    backgroundColor: "#007bff",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                }}
                onPress={() => navigation.navigate("ResultsScreen", { depart, arrivee })}
            >
                <Text style={{ color: "white", fontSize: 18 }}>🔍 Rechercher Trajet</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SearchScreen;
