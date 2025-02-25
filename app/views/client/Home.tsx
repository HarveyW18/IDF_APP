import React, { useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useAuthViewModel } from "../../viewmodels/authViewModel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "../../../components/Navbar";
import MapComponent from "../../../components/MapComponent"; // 🔥 Import de la carte

const HomeScreen = () => {
    const { user } = useAuthViewModel();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    const handlePress = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: -300, duration: 400, useNativeDriver: true }),
        ]).start(() => {
            router.push("/views/client/SearchScreen");

            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]).start();
        });
    };

    return (
        <View style={styles.container}>
            {/* 🌍 Composant de la carte */}
            <View style={styles.mapContainer}>
                <MapComponent />
            </View>

            {/* 📌 Carte utilisateur */}
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Bonjour,</Text>
                        <Text style={styles.name}>{user ? user.email : "Utilisateur"}</Text>
                        <Image source={require("../../../assets/avatar/avatar.png")} style={styles.avatar} />
                    </View>

                    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8} onPress={handlePress}>
                            <Ionicons name="search" size={20} color="#A0A0A0" />
                            <Text style={styles.searchText}>Rechercher un itinéraire</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

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
        height: "100%", // 🔥 Augmente la hauteur de la carte pour qu’elle descende sous la carte profil
        top: 0, // Position en haut
    },
    card: {
        position: "absolute",
        width: "98%",
        height: "45%",
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
