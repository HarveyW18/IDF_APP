import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TrajetProps {
    trajet: {
        summary: {
            duration: number;
            length: number;
        };
        transport: {
            mode: string;
        };
    };
}

const TrajetCard: React.FC<TrajetProps> = ({ trajet }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.text}>🚌 Mode: {trajet.transport.mode}</Text>
            <Text style={styles.text}>📏 Distance: {trajet.summary.length / 1000} km</Text>
            <Text style={styles.text}>⏳ Durée: {Math.floor(trajet.summary.duration / 60)} min</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
    },
});

export default TrajetCard;
