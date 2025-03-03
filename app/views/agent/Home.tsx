import React, { useRef, useEffect } from "react";
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
import { useAssistanceViewModel } from "../../viewmodels/assistViewModel";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Import pour l'effet de flou

const { height } = Dimensions.get("window");

const AgentHome = () => {
  const { acceptedMissions, pendingRequests, loading, error } = useAssistanceViewModel();
  const { user } = useAuthViewModel();

  // 🔥 Animation de fondu
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* 📌 Carte utilisateur */}

      {loading ? (
        <ActivityIndicator size="large" color="#79c595" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {acceptedMissions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Aujourd'hui :</Text>
              {acceptedMissions.map((item) => (
                <AssistanceCard key={item.id} assistance={{ ...item, typeTransport: item.typeTransport || "Inconnu" }} isAccepted />
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>Vos missions à venir :</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AssistanceCard assistance={{ ...item, typeTransport: item.typeTransport || "Inconnu" }} />}
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
    backgroundColor: "white", // ✅ Fond blanc
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
    color: "#79c595", // ✅ Couleur verte en accent
    marginVertical: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  list: {
    paddingBottom: 180, // ✅ Ajusté pour éviter l'écrasement avec la navbar
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
