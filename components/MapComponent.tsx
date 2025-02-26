import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, UrlTile, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const MapComponent = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mapRef = useRef<MapView | null>(null); // Référence à la carte

    // 🎯 Fonction pour récupérer la position de l'utilisateur
    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            setErrorMsg("Permission refusée");
            Alert.alert("Erreur", "Accès à la localisation refusé !");
            return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
        };

        setLocation(newLocation);

        // 🔄 Déplacer la carte vers la position de l'utilisateur
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                ...newLocation,
                latitudeDelta: 0.01, // Zoom ajusté
                longitudeDelta: 0.01,
            });
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 48.85717, // Paris
                    longitude: 2.3414,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                mapType="standard" // 🌍 Toujours en mode clair
            >
                {/* 🗺️ OpenStreetMap en fond */}
                <UrlTile urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

                {/* 📍 Zone de localisation de l'utilisateur */}
                {location && (
                    <>
                        {/* Cercle autour de la position */}
                        <Circle
                            center={location}
                            radius={150} // Rayon de 100m
                            strokeColor="rgba(0, 122, 255, 0.5)"
                            fillColor="rgba(0, 122, 255, 0.2)"
                        />

                        {/* Point central représentant l'utilisateur */}
                        <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
                            <View style={styles.userLocationMarker} />
                        </Marker>
                    </>
                )}
            </MapView>

            {/* 🔘 Bouton flottant pour activer la localisation */}
            <TouchableOpacity style={styles.locateButton} onPress={getUserLocation}>
                <Ionicons name="navigate" size={22} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: "100%", height: "100%" },
    locateButton: {
        position: "absolute",
        bottom: 800,
        right: 20,
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 50,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    userLocationMarker: {
        width: 18,
        height: 18,
        backgroundColor: "#007AFF",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "white",
    },
});

export default MapComponent;
