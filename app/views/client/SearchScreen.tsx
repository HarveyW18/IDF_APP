import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomHeader from "../../../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../../components/SearchBar";
import { obtenirItineraires } from "../../services/itineraireService";
import TrajetCard from "../../../components/TrajetCard";
import Navbar from "../../../components/Navbar";

const SearchScreen = () => {
    const [depart, setDepart] = useState("");
    const [arrivee, setArrivee] = useState("");
    const [trajets, setTrajets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [timeOffset, setTimeOffset] = useState(0);

    const swapLocations = () => {
        setDepart(arrivee);
        setArrivee(depart);
    };

    // Fonction pour chercher les trajets et les afficher
    const chercherTrajets = async () => {
        if (!depart || !arrivee) return;
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const result = await obtenirItineraires(depart, arrivee);
            if (result && result.length > 0) {
                setTrajets(result[0].sections || []);
            } else {
                setError("Aucun itinéraire trouvé.");
                setTrajets([]);
            }
        } catch (err) {
            setError("Erreur lors de la récupération des itinéraires.");
            console.error("❌ Erreur API :", err);
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* 🏷️ En-tête personnalisé */}
            <CustomHeader title="Recherche" />
            {/* 📍 Départ & Arrivée */}
            <View style={styles.inputContainer}>
                <SearchBar label="Départ" placeholder="Entrez un lieu de départ" onSelect={setDepart} value={depart} />

                <SearchBar label="Arrivée" placeholder="Entrez un lieu d’arrivée" onSelect={setArrivee} value={arrivee} />
            </View>


            {/* ⏳ Sélecteur de temps */}
            <View style={styles.timeContainer}>
                <Text style={styles.label}>Départ</Text>
                <Text style={styles.timeText}>Maintenant</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => setTimeOffset(timeOffset - 10)}>
                    <Text style={styles.timeButtonText}>-10 min</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.timeButton, styles.timeButtonActive]} onPress={() => setTimeOffset(timeOffset + 10)}>
                    <Text style={styles.timeButtonTextActive}>+10 min</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={chercherTrajets}>
                <Text style={styles.buttonText}>🔍 Rechercher Trajet</Text>
            </TouchableOpacity>

            {hasSearched && <View style={styles.separator} />}

            {/* 📜 Liste des résultats avec espace pour la navbar */}
            <View style={styles.resultContainer}>
                {hasSearched && (
                    loading ? <ActivityIndicator size="large" color="#007bff" />
                        : error ? <Text style={styles.error}>{error}</Text>
                            : trajets.length === 0 ? <Text style={styles.noResult}>Aucun trajet disponible</Text>
                                : <FlatList
                                    data={trajets}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => <TrajetCard trajet={item} />}
                                    contentContainerStyle={{ paddingBottom: 90 }} // 📌 Espace pour la navbar
                                />
                )}
            </View>

            {/* 🌫 Dégradé pour transition fluide entre résultats et navbar */}
            <LinearGradient
                colors={["transparent", "transparent", "transparent"]}
                style={styles.gradientOverlay}
            />

            {/* 🚀 Navbar */}
            <Navbar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
    },
    inputContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: "column",
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        color: "#999",
        marginBottom: 5,
    },
    swapButton: {
        position: "absolute",
        right: 10,
        top: "40%",
        backgroundColor: "white",
        borderRadius: 30,
        padding: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        padding: 10,
        justifyContent: "space-between",
    },
    timeText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    timeButton: {
        backgroundColor: "#E0E0E0",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    timeButtonText: {
        fontSize: 16,
        color: "#666",
    },
    timeButtonActive: {
        backgroundColor: "#007bff",
    },
    timeButtonTextActive: {
        fontSize: 16,
        color: "white",
    },
    separator: { // ✅ Ajouté pour éviter l'erreur
        marginTop: 20,
        height: 1,
        backgroundColor: "#ccc",
    },
    resultContainer: { // ✅ Ajouté pour éviter l'erreur
        flex: 1,
        marginBottom: 20, // 📌 Ajoute un espace pour la navbar
    },
    error: { // ✅ Ajouté pour éviter l'erreur
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    noResult: { // ✅ Ajouté pour éviter l'erreur
        textAlign: "center",
        marginTop: 20,
        color: "#555",
    },
    gradientOverlay: { // ✅ Ajouté pour éviter l'erreur
        position: "absolute",
        bottom: 75, // 📌 Ajusté pour mieux suivre la navbar
        left: 0,
        right: 0,
        height: 60, // Augmente pour un effet plus doux
    },
    button: {
        marginTop: 20,
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
    },
});

export default SearchScreen;