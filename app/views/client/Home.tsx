import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useAuthViewModel } from "../../viewmodels/authViewModel";
import { WebView } from "react-native-webview";
import { getHereMapHTML } from "../../viewmodels/HereMapViewModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "../../../components/Navbar";

const HomeScreen = () => {
    const { user } = useAuthViewModel();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    // Fonction pour gérer l'animation avant la navigation
    const handlePress = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0, // Diminue l'opacité progressivement
                duration: 400, 
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -300, // Fait glisser vers la gauche
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            router.push("/views/client/SearchScreen"); // Navigation après l'animation

            // Réinitialisation des animations après la navigation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1, // Réaffichage en douceur
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0, // Retour à la position initiale
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    return (
        <View style={styles.container}>
            {/* 🌍 Carte HERE Maps */}
            <Animated.View style={[styles.mapContainer, { opacity: fadeAnim }]}>
                <WebView source={{ html: getHereMapHTML() }} style={styles.map} />
            </Animated.View>

            {/* 📌 Carte utilisateur */}
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Bonjour,</Text>
                        <Text style={styles.name}>{user ? user.email : "Utilisateur"}</Text>
                        <Image source={require("../../../assets/avatar/avatar.png")} style={styles.avatar} />
                    </View>

                    {/* 🔍 Barre de recherche animée avec effet de slide */}
                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <TouchableOpacity 
                            style={styles.searchBar} 
                            activeOpacity={0.8} 
                            onPress={handlePress}
                        >
                            <Ionicons name="search" size={20} color="#A0A0A0" />
                            <Text style={styles.searchText}>Rechercher un itinéraire</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* 🚀 Barre de navigation incluse dans la card */}
                <Navbar />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },
    mapContainer: {
        width: "100%",
        height: "50%",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    card: {
        position: "absolute",
        width: "97%",
        height: "40%",
        bottom: 0,
        alignSelf: "center",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
        justifyContent: "space-between",
    },
    content: {
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    greeting: {
        fontSize: 16,
        color: "#555",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: "auto",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEF1F6",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginTop: 20,
    },
    searchText: {
        fontSize: 16,
        color: "#A0A0A0",
        marginLeft: 10,
    },
});

export default HomeScreen;
