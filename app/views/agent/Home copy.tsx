import React, { useRef, useEffect, useState } from "react";
import {
  View,
  ScrollView,
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
import { fetchPendingAssistances, fetchAcceptedAssistances, fetchAllAssistances } from "../../services/assistService"; // 🔥 API pour récupérer les assistances
import { Assistance } from "../../models/Assistance"; // 🔥 Import du type Assistance
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

const AgentHome = () => {
  const { user } = useAuthViewModel();
  const [assistances, setAssistances] = useState<Assistance[]>([]);
  const [acceptedMissions, setAcceptedMissions] = useState<Assistance[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Assistance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cachePendingRequests = useRef<Assistance[]>([]);
  const cacheAcceptedMissions = useRef<Assistance[]>([]);

  // 🔥 Animation de fondu
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔄 Fonction pour récupérer les assistances
  const fetchAssistances = async () => {
    setLoading(true);
    try {
      console.log("🔍 fetchAssistances() - Début");

      const firebaseUid = user?.uid;
      if (!firebaseUid) throw new Error("Utilisateur non connecté.");
      console.log(`✅ UID Firebase Agent : ${firebaseUid}`);

      // 🔥 Récupérer missions en attente & missions acceptées
      const newPending = await fetchPendingAssistances();
      const newAccepted = await fetchAcceptedAssistances(firebaseUid);

      console.log("🚀 Nouvelles missions en attente :", newPending);
      console.log("✅ Nouvelles missions acceptées :", newAccepted);

      // ✅ Comparer avec le cache
      const updatedPending = [...cachePendingRequests.current];
      const updatedAccepted = [...cacheAcceptedMissions.current];

      // 🔍 Ajouter uniquement les nouvelles missions (éviter doublons)
      newPending.forEach((mission) => {
        if (!updatedPending.some((m) => m.id === mission.id)) {
          updatedPending.push(mission);
        }
      });

      newAccepted.forEach((mission) => {
        if (!updatedAccepted.some((m) => m.id === mission.id)) {
          updatedAccepted.push(mission);
        }
      });

      // 📝 Mettre à jour les états & le cache
      setPendingRequests(updatedPending);
      setAcceptedMissions(updatedAccepted);
      cachePendingRequests.current = updatedPending;
      cacheAcceptedMissions.current = updatedAccepted;

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
    const interval = setInterval(fetchAssistances, 300000);
    return () => clearInterval(interval);
  }, []);

  // 🛠️ Fonction pour mettre à jour le statut d'une assistance
  const handleUpdateStatus = (id: number, newStatus: "accepted" | "pending") => {
    setAssistances((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    if (newStatus === "accepted") {
      setAcceptedMissions((prev) => [...prev, { ...assistances.find((item) => item.id === id)!, status: "accepted" }]);
      setPendingRequests((prev) => prev.filter((item) => item.id !== id));
    } else {
      setPendingRequests((prev) => [...prev, { ...assistances.find((item) => item.id === id)!, status: "pending" }]);
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
        
        <FlatList
          data={[...acceptedMissions, ...pendingRequests]}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <>
              {item.status === "accepted" && acceptedMissions.indexOf(item) === 0 && (
                <Text style={styles.sectionTitle}>Missions acceptées :</Text>
              )}

              {item.status === "pending" && pendingRequests.indexOf(item) === 0 && (
                <Text style={styles.sectionTitle}>Missions en attente :</Text>
              )}

              <AssistanceCard
                assistance={item}
                isAccepted={item.status === "accepted"}
                onUpdateStatus={handleUpdateStatus}
                fetchAssistances={fetchAssistances}
              />
            </>
          )}
          contentContainerStyle={{ paddingBottom: 200 }} // Ajoute un espace en bas !
        />
      )}

      {/* 🌫 Dégradé pour éviter la superposition avec la navbar */}
      <LinearGradient colors={["transparent", "transparent", "transparent"]} style={styles.gradientOverlay} />

      {/* 📌 Carte utilisateur */}
      <Animated.View style={[styles.card, { opacity: fadeAnim, bottom: 10 }]}>
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
