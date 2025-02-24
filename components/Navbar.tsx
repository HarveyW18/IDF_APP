import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Accueil */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("HomeScreen")}>
                <Ionicons name="home" size={24} color="white" />
                <Text style={styles.activeText}>Accueil</Text>
            </TouchableOpacity>

            {/* Transports */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("TransportsScreen")}>
                <MaterialCommunityIcons name="bus-multiple" size={24} color="white" />
            </TouchableOpacity>

            {/* Messages */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("MessagesScreen")}>
                <FontAwesome name="comments" size={22} color="white" />
            </TouchableOpacity>

            {/* Profil */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ProfileScreen")}>
                <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20, // Légèrement détaché du bas
        left: 20,
        right: 20,
        flexDirection: "row",
        backgroundColor: "#3C85FF",
        paddingVertical: 12,
        borderRadius: 50,
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 5, // Ombre pour effet flottant (Android)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5, // Ombre pour effet flottant (iOS)
    },
    navItem: {
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    activeText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 2,
    },
});

export default Navbar;
