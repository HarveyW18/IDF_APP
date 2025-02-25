import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface Section {
    id: string;
    type: string;
    departure: { time: string; place: { name?: string } };
    arrival: { time: string; place: { name?: string } };
    transport?: { mode?: string; name?: string; category?: string; color?: string };
}

interface TrajetProps {
    trajet: {
        summary?: { duration?: number };
        sections?: Section[];
    };
}

const getTransportIcon = (mode?: string) => {
    if (!mode) return "route";
    switch (mode.toLowerCase()) {
        case "bus":
            return "bus";
        case "subway":
        case "metro":
            return "subway";
        case "regionaltrain":
        case "train":
        case "rer":
            return "train";
        case "tram":
            return "train-tram";
        case "pedestrian":
            return "walking";
        default:
            return "route";
    }
};

const TrajetCard: React.FC<TrajetProps> = ({ trajet }) => {
    const sections = trajet.sections ?? [];

    // Extraction des horaires de départ et d'arrivée
    const departureTime = sections[0]?.departure.time?.slice(11, 16) || "--:--";
    const arrivalTime = sections[sections.length - 1]?.arrival.time?.slice(11, 16) || "--:--";

    // Calculs des temps de trajet
    let totalWalkingTime = 0;
    let totalTransitTime = 0;

    sections.forEach(section => {
        if (section.type === "pedestrian") {
            totalWalkingTime += new Date(section.arrival.time).getTime() - new Date(section.departure.time).getTime();
        } else if (section.type === "transit") {
            totalTransitTime += new Date(section.arrival.time).getTime() - new Date(section.departure.time).getTime();
        }
    });

    // Conversion en minutes
    const walkingMinutes = Math.floor(totalWalkingTime / 60000);
    const transitMinutes = Math.floor(totalTransitTime / 60000);
    const totalMinutes = walkingMinutes + transitMinutes;

    // Filtrer les sections de transport uniquement
    const transportSections = sections.filter(sec => sec.transport?.mode !== "pedestrian");

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                {/* Icônes des transports */}
                <View style={styles.transportIcons}>
                    {transportSections.map((section, index) => (
                        <View key={index} style={[styles.iconContainer, { backgroundColor: section.transport?.color || "#ccc" }]}>
                            <FontAwesome5 name={getTransportIcon(section.transport?.mode)} size={14} color="#fff" />
                        </View>
                    ))}
                </View>

                {/* Détails du trajet */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.time}>{departureTime} → {arrivalTime}</Text>
                    <Text style={styles.duration}>{totalMinutes} min</Text>
                    <Text style={styles.walking}>🚶 {walkingMinutes} min</Text>
                </View>
            </View>

            {/* Ligne de transports utilisés */}
            <View style={styles.transportLine}>
                {transportSections.map((section, index) => (
                    <View key={index} style={styles.transportBadge}>
                        <Text style={[styles.transportText, { backgroundColor: section.transport?.color || "#ddd" }]}>
                            {section.transport?.name}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    transportIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    detailsContainer: {
        marginLeft: 10,
    },
    time: {
        fontSize: 16,
        fontWeight: "bold",
    },
    duration: {
        fontSize: 14,
        color: "#777",
    },
    walking: {
        fontSize: 12,
        color: "#888",
    },
    transportLine: {
        flexDirection: "row",
        marginTop: 8,
    },
    transportBadge: {
        borderRadius: 5,
        overflow: "hidden",
        marginRight: 5,
    },
    transportText: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        borderRadius: 5,
    },
});

export default TrajetCard;
