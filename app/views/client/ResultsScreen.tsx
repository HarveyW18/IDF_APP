import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useTrajetViewModel from "../../viewmodels/trajetViewModel";
import TrajetCard from "../../../components/TrajetCard";

const ResultsScreen = () => {
    const { depart, arrivee } = useLocalSearchParams<{ depart: string; arrivee: string }>();
    const { trajets, loading, error, chargerItineraires } = useTrajetViewModel();

    useEffect(() => {
        chargerItineraires(depart, arrivee);
    }, [depart, arrivee]);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Départ: {depart}</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Arrivée: {arrivee}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={{ color: "red" }}>{error}</Text>
            ) : !trajets || trajets.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>Aucun itinéraire trouvé.</Text>
            ) : (
                <FlatList
                    data={trajets}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <TrajetCard trajet={item} />}
                />
            )}
        </View>
    );
};

export default ResultsScreen;
