// views/agent/AgentHome.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import Navbar from "../../../components/Navbar";
import AssistanceCard from "../../../components/AssistanceCard";
import { useAssistanceViewModel } from "../../viewmodels/assistViewModel";

const { height } = Dimensions.get("window");

const AgentHome = () => {
  const { acceptedMissions, pendingRequests, loading, error } = useAssistanceViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bonjour, <Text style={styles.bold}>John Doe</Text></Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {acceptedMissions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Aujourd'hui :</Text>
              {acceptedMissions.map((item) => (
                <AssistanceCard key={item.id} assistance={item} isAccepted />
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>Vos missions à venir :</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AssistanceCard assistance={item} />}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: height * 0.05,
  },
  header: {
    fontSize: 22,
    color: "#333",
    textAlign: "left",
    marginBottom: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginVertical: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  list: {
    paddingBottom: 100,
  },
});

export default AgentHome;
