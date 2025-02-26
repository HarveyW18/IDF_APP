import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import useAssistViewModel from "../app/viewmodels/assistViewModel";

interface AssistButtonProps {
    token: string;
    user: any;
    trajet: any;
}

const AssistButton: React.FC<AssistButtonProps> = ({ token, user, trajet }) => {
    const { demanderAssistance, loading, success, error } = useAssistViewModel();

    const handlePress = () => {
        if (!loading) {
            demanderAssistance(token, user, trajet); // ✅ Ne passe que 3 arguments
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.button, success ? styles.success : error ? styles.error : null]} 
            onPress={handlePress} 
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : success ? (
                <Text style={styles.text}>✅ Assistance demandée !</Text>
            ) : error ? (
                <Text style={styles.text}>❌ Erreur, réessayer</Text>
            ) : (
                <Text style={styles.text}>🦽 Demander Assistance</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    success: {
        backgroundColor: "#28a745",
    },
    error: {
        backgroundColor: "#dc3545",
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AssistButton;
