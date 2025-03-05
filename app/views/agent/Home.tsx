import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import Navbar from "../../../components/Navbar";
import AssistanceCard from "../../../components/AssistanceCard";
import { useAuthViewModel } from "../../viewmodels/authViewModel";
import { fetchPendingAssistances, fetchAcceptedAssistances } from "../../services/assistService"; // 🔥 API pour récupérer les assistances
import { Assistance } from "../../models/Assistance"; // 🔥 Import du type Assistance
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

const AgentHome = () => {
  const { user } = useAuthViewModel();

  // ✅ Correction : Typage explicite des états
  const [assistances, setAssistances] = useState<Assistance[]>([]);
  const [acceptedMissions, setAcceptedMissions] = useState<Assistance[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Assistance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Animation de fondu
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔄 Fonction pour récupérer les assistances
  const fetchAssistances = async () => {
    setLoading(true);
    try {
      console.log("🔍 fetchAssistances() - Début");

      const firebaseUid = user?.uid; // ✅ Récupérer l'UID Firebase de l'agent connecté
      if (!firebaseUid) throw new Error("Utilisateur non connecté.");
      console.log(`✅ UID Firebase Agent : ${firebaseUid}`);

      // 🔥 Récupérer les missions en attente
      const pendingData = await fetchPendingAssistances();
      console.log("🚀 Missions en attente reçues :", pendingData);

      // 🔥 Récupérer les missions acceptées par l'agent
      const acceptedData = await fetchAcceptedAssistances(firebaseUid);
      console.log("✅ Missions acceptées reçues :", acceptedData);

      setPendingRequests(pendingData);
      setAcceptedMissions(acceptedData);

      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des assistances.");
    } finally {
      setLoading(false);
    }
  };


  // 🔄 Mise à jour automatique toutes les 30 secondes
  useEffect(() => {
    fetchAssistances();
    const interval = setInterval(() => {
      fetchAssistances();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🛠️ Fonction pour mettre à jour le statut d'une assistance
  const handleUpdateStatus = (id: number, newStatus: "acceptée" | "en attente") => {
    setAssistances((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    if (newStatus === "acceptée") {
      setAcceptedMissions((prev) => [...prev, { ...assistances.find((item) => item.id === id)!, status: "acceptée" }]);
      setPendingRequests((prev) => prev.filter((item) => item.id !== id));
    } else {
      setPendingRequests((prev) => [...prev, { ...assistances.find((item) => item.id === id)!, status: "en attente" }]);
      setAcceptedMissions((prev) => prev.filter((item) => item.id !== id));
    }
  };



  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#79c595" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {/* 🔥 Missions acceptées en haut */}
          {acceptedMissions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Missions acceptées :</Text>
              {acceptedMissions.map((item) => (
                <AssistanceCard
                  key={item.id}
                  assistance={item}
                  isAccepted
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </>
          )}

          {/* 🔥 Missions en attente en dessous */}
          <Text style={styles.sectionTitle}>Missions en attente :</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <AssistanceCard
                assistance={item}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {/* 🌫 Dégradé pour éviter la superposition avec la navbar */}
      <LinearGradient colors={["transparent", "transparent", "transparent"]} style={styles.gradientOverlay} />

      {/* 📌 Carte utilisateur */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}</Text>
            <Image source={require("../../../assets/avatar/avatar2.webp")} style={styles.avatar} />
          </View>
        </View>
      </Animated.View>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: height * 0.05,
  },
  card: {
    position: "absolute",
    width: "105%",
    height: "20%",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#79c595",
    marginVertical: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  list: {
    paddingBottom: 180,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 75,
    left: 0,
    right: 0,
    height: 60,
  },
});

export default AgentHome;
