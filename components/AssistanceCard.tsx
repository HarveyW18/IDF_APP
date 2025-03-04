import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { accepterReservation, libererReservation } from "../app/services/assistService"; // 🛠️ API de mise à jour

const { width } = Dimensions.get("window");

interface AssistanceProps {
  assistance: {
    id: number;
    pmrName: string;
    pmrAvatarUrl?: string;
    departure: string;
    destination: string;
    typeTransport: string;
    handicapType: string;
    time?: string;
    arrivalTime?: string;
    duration?: number;
    status: string;
  };
  onUpdateStatus: (id: number, newStatus: string) => void;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// ✅ Formatage de la durée en HH:mm
const formatDuration = (seconds?: number) => {
  if (!seconds) return "Inconnu";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} h ${minutes.toString().padStart(2, "0")}`;
};

const AssistanceCard: React.FC<AssistanceProps> = ({ assistance, onUpdateStatus }) => {
  const [status, setStatus] = useState(assistance.status);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const result = await accepterReservation(assistance.id);
      if (result) {
        setStatus("acceptée");
        onUpdateStatus(assistance.id, "acceptée");
        Alert.alert("✅ Réservation acceptée !");
      }
    } catch (error) {
      console.error("❌ Erreur acceptation :", error);
    }
    setLoading(false);
  };

  // ✅ Fonction pour libérer la réservation
  const handleRelease = async () => {
    try {
      const result = await libererReservation(assistance.id);
      if (result) {
        setStatus("en attente");
        onUpdateStatus(assistance.id, "en attente");
        Alert.alert("🔄 Réservation remise en attente.");
      }
    } catch (error) {
      console.error("❌ Erreur libération :", error);
    }
  };

  {
    status === "acceptée" && (
      <TouchableOpacity style={styles.releaseButton} onPress={handleRelease}>
        <Text style={styles.releaseText}>Libérer</Text>
      </TouchableOpacity>
    )
  }

  const renderRightActions = () => (
    <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
      <Text style={styles.acceptText}>Accepter</Text>
      <FontAwesome6 name="check-circle" size={20} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.card, status === "acceptée" ? styles.acceptedCard : styles.pendingCard]}>
      <View style={styles.header}>
        <FontAwesome6 name="user" size={22} color="white" />
        <Text style={styles.name}>{assistance.pmrName}</Text>
        {assistance.pmrAvatarUrl && <Image source={{ uri: assistance.pmrAvatarUrl }} style={styles.avatar} />}
      </View>

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
          <Text style={styles.details}>Durée : {formatDuration(assistance.duration)} min</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome6 name="wheelchair" size={16} color="white" />
          <Text style={styles.details}>{assistance.handicapType || "Non spécifié"}</Text>
        </View>
      </View>

      {status === "en attente" && (
        <Pressable onPress={handleAccept} style={styles.acceptButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <FontAwesome6 name="check-circle" size={20} color="white" />
              <Text style={styles.acceptText}>Accepter</Text>
            </>
          )}
        </Pressable>
      )}

      {status === "acceptée" && (
        <Pressable onPress={handleRelease} style={styles.releaseButton}>
          <FontAwesome6 name="times-circle" size={20} color="white" />
          <Text style={styles.releaseText}>Annuler</Text>
        </Pressable>
      )}
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
  acceptButton: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
  },
  acceptText: { color: "white", fontWeight: "bold", marginRight: 10 },
  releaseButton: { marginTop: 10, alignSelf: "center", padding: 10, backgroundColor: "orange", borderRadius: 10 },
  releaseText: { color: "white", fontWeight: "bold" },
});

export default AssistanceCard;
