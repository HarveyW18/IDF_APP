import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface AssistanceProps {
  assistance: {
    pmrName: string;
    pmrAvatarUrl?: string;
    departure: string;
    destination: string;
    typeTransport: string;
    handicapType: string;
    time?: string;
    arrivalTime?: string;
    duration?: number;
  };
  isAccepted?: boolean;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};


// ✅ Fonction pour formater la durée en HH:mm
const formatDuration = (seconds?: number) => {
  if (!seconds) return "Inconnu";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h${minutes.toString().padStart(2, "0")}`;
};

const AssistanceCard: React.FC<AssistanceProps> = ({ assistance, isAccepted = false }) => {
  return (
    <View style={[styles.card, isAccepted ? styles.acceptedCard : styles.pendingCard]}>
      <View style={styles.header}>
        <FontAwesome6 name="user" size={22} color="white" />
        <Text style={styles.name}>{assistance.pmrName}</Text>
        {/* ✅ Avatar PMR à droite */}
        {assistance.pmrAvatarUrl && (
          <Image source={{ uri: assistance.pmrAvatarUrl }} style={styles.avatar} />
        )}
      </View>

      {/* 🔹 Départ / Arrivée alignés horizontalement */}
      <View style={styles.routeContainer}>
        <View style={styles.departure}>
          <FontAwesome6 name="location-dot" size={15} color="white" />
          <Text style={styles.details}>{truncateText(assistance.departure, 15)}</Text>
        </View>
        <FontAwesome6 name="arrows-left-right" size={18} color="white" />
        <View style={styles.destination}>
          <FontAwesome6 name="location-dot" size={15} color="white" />
          <Text style={styles.details}>{truncateText(assistance.destination, 15)}</Text>
        </View>
      </View>

      {/* 🔹 Détails du trajet */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <FontAwesome6 name="train" size={16} color="white" />
          <Text style={styles.details}>{assistance.typeTransport}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome6 name="clock" size={16} color="white" />
          <Text style={styles.details}>Départ : {assistance.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome6 name="hourglass-half" size={16} color="white" />
          <Text style={styles.details}>Durée : {formatDuration(assistance.duration)}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome6 name="wheelchair" size={16} color="white" />
          <Text style={styles.details}>
            {assistance.handicapType && assistance.handicapType !== ""
              ? assistance.handicapType
              : "Non spécifié"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    width: width * 0.9,
    alignSelf: "center",
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection: "column",
  },
  acceptedCard: {
    backgroundColor: "#1B5E20",
  },
  pendingCard: {
    backgroundColor: "#79c595",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  departure: {
    flexDirection: "row",
    alignItems: "center",
  },
  destination: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "white",
    marginLeft: 8,
  },
});

export default AssistanceCard;
