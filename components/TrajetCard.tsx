import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Section {
    id: string;
    type: string;
    departure: { time: string; place: { name?: string } };
    arrival: { time: string; place: { name?: string } };
    transport?: { mode?: string; name?: string; category?: string; color?: string; headsign?: string };
}

interface TrajetProps {
    depart: string;
    arrivee: string;
    trajet: {
        summary?: { duration?: number };
        sections?: Section[];
    };
}

const getTransportIcon = (mode?: string, category?: string, name?: string) => {
    if (!mode) return "route";

    switch (mode.toLowerCase()) {
        case "bus": return "bus";
        case "subway":
        case "metro": return "train-subway"; // ✅ Icône métro FA6
        case "tram": return "train-tram"; // ✅ Icône tramway FA6

        case "heavy_rail":
        case "train":
        case "regionaltrain":
            if (category === "Train" && /^[A-Z]$/.test(name || "")) {
                return "train"; // ✅ RER (A-Z)
            }
            return "train"; // ✅ TER, TGV et autres trains

        case "walking": return "person-walking"; // ✅ Icône FA6
        case "bike": return "bicycle";
        case "car": return "car";
        case "boat": return "ship";
        case "taxi": return "taxi";
        default: return "route";
    }
};





const TrajetCard: React.FC<TrajetProps> = ({ trajet, depart, arrivee }) => {
    if (!trajet || !Array.isArray(trajet.sections) || trajet.sections.length === 0) {
        return <Text>❌ Aucune section trouvée</Text>;
    }

    const sections = trajet.sections;
    const now = new Date();

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}min` : `${m}min`;
    };

    let totalWalkingTime = 0;
    let totalTransitTime = 0;

    sections.forEach(section => {
        if (section.departure.time && section.arrival.time) {
            const depTime = new Date(`1970-01-01T${section.departure.time}`).getTime();
            const arrTime = new Date(`1970-01-01T${section.arrival.time}`).getTime();
            if (section.type === "walking") {
                totalWalkingTime += arrTime - depTime;
            } else if (section.type === "transit") {
                totalTransitTime += arrTime - depTime;
            }
        }
    });

    const walkingMinutes = Math.floor(totalWalkingTime / 60000);
    const transitMinutes = Math.floor(totalTransitTime / 60000);
    const totalMinutes = trajet.summary?.duration ? Math.floor(trajet.summary.duration / 60) : 0;

    const departureTime = sections[0]?.departure.time || `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const arrivalTime = new Date(now.getTime() + totalMinutes * 60000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });

    let departurePlace = depart;
    for (const section of sections) {
        if (section.type === "transit" && section.departure.place.name) {
            departurePlace = section.departure.place.name;
            break;
        }
    }

    let arrivalPlace = arrivee;
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].type === "transit" && sections[i].arrival.place.name) {
            arrivalPlace = sections[i].arrival.place.name;
            break;
        }
    }

    const transportSections = sections.filter(sec => sec.transport?.mode !== "walking");

    return (
        <View style={styles.card}>
            <Text style={styles.station}>{departurePlace} → {arrivalPlace}</Text>
            <View style={styles.row}>
                <Text style={styles.time}>{departureTime} → {arrivalTime}</Text>
                <Text style={styles.duration}>{formatDuration(totalMinutes)}</Text>
            </View>

            <View style={styles.transportLine}>
                {transportSections
                    .filter(section => section.transport?.name) // Filtrer uniquement les sections avec un nom de transport
                    .map((section, index) => (
                        <View key={index} style={styles.transportItem}>
                            <View style={[styles.iconContainer, { backgroundColor: section.transport?.color || "#ddd" }]}>
                                {section.transport?.mode && (
                                    <FontAwesome6 name={getTransportIcon(section.transport?.mode)} size={14} color="#fff" />
                                )}
                            </View>
                            <View style={[styles.transportBadge, { backgroundColor: section.transport?.color || "#ddd" }]}>
                                <Text style={styles.transportText}>
                                    {section.transport?.name} {section.transport?.headsign ? ` → ${section.transport.headsign}` : ""}
                                </Text>
                            </View>
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
        justifyContent: "space-between",
    },
    station: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
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
        flexWrap: "wrap",
    },
    transportBadge: {
        borderRadius: 5,
        overflow: "hidden",
        marginRight: 5,
        marginBottom: 5,
    },
    transportText: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        borderRadius: 5,
    },
    transportItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
    },

    noData: {
        fontSize: 16,
        textAlign: "center",
        color: "#ff4444",
        padding: 10,
    }
});

export default TrajetCard;
