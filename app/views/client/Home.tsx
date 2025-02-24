import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useAuthViewModel } from "../../viewmodels/authViewModel"; 
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "SearchScreen">>();
    const { user } = useAuthViewModel(); // Récupérer l'utilisateur connecté

    // Animation pour la transition
    const fadeAnim = new Animated.Value(1);

    const handlePress = () => {
        Animated.timing(fadeAnim, {
            toValue: 0, // Réduire l'opacité avant navigation
            duration: 200, // Durée de l'animation
            useNativeDriver: true,
        }).start(() => {
            navigation.navigate("SearchScreen"); // Naviguer après l'animation
        });
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* 🗺️ Carte en arrière-plan */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 48.8566, // Exemple : Paris
                    longitude: 2.3522,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            />

            {/* 🔹 Carte de bienvenue */}
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Bonjour,</Text>
                    <Text style={styles.name}>Hi {user ? user.email : "Utilisateur"}</Text>
                    <Image source={require("../../../assets/avatar/avatar.png")} style={styles.avatar} />
                </View>

                {/* 🔍 Barre de recherche */}
                <TouchableOpacity onPress={handlePress} style={styles.searchBar}>
                    <TextInput
                        placeholder="Rechercher un itinéraire"
                        style={styles.input}
                        editable={false} // Désactivé pour utiliser le TouchableOpacity
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject, // Prend tout l'écran
    },
    card: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: "auto",
    },
    searchBar: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#555",
    },
});

export default HomeScreen;
