import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface AssistanceProps {
  assistance: {
    pmrName: string;
    pmrAvatarUrl: string;
    disabilityType: string;
    departure: string;
    destination: string;
    time?: string; // ✅ Rend `time` optionnel pour éviter les erreurs
  };
  isAccepted?: boolean;
}

const AssistanceCard: React.FC<AssistanceProps> = ({ assistance, isAccepted = false }) => {
  console.log("🚀 Assistance data:", assistance);
  if (!assistance) {
    return <Text style={styles.details}>❌ Erreur : données assistance introuvables</Text>;
  }
  return (
    <View style={[styles.card, isAccepted ? styles.acceptedCard : styles.pendingCard]}>
      <View style={styles.header}>
        <MaterialIcons name="person" size={20} color="white" />
        <Text style={styles.name}>{assistance.pmrName}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.details}>
          📅 Date : {typeof assistance.time === "string" && assistance.time.includes("T") ? assistance.time.split("T")[0] : "Inconnue"}
        </Text>
        <Text style={styles.details}>📍 Départ : {assistance.departure}</Text>
        <Text style={styles.details}>📍 Arrivée : {assistance.destination}</Text>
      </View>

      {/* Icone menu */}
      <MaterialIcons name="more-horiz" size={24} color="white" style={styles.menuIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: width * 0.9,
    alignSelf: "center",
    position: "relative",
  },
  acceptedCard: {
    backgroundColor: "#1B5E20",
  },
  pendingCard: {
    backgroundColor: "#388E3C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  detailsContainer: {
    marginLeft: 25,
  },
  details: {
    fontSize: 14,
    color: "white",
  },
  menuIcon: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
});

export default AssistanceCard;
