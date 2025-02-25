import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title: string;
  titleColor?: string; // Permet de changer la couleur du titre
  backButtonColor?: string; // Permet de changer la couleur du bouton retour
  backgroundColor?: string; // Permet de changer la couleur de l'en-tête
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  title, 
  titleColor = "#1e1e1e",  
  backButtonColor = "#3C85FF", 
  backgroundColor = "#FFFFFF" 
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor }]}>
        {/* 🔙 Bouton retour */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={backButtonColor} />
        </TouchableOpacity>

        {/* 🏷️ Titre centré */}
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centre le titre
    height: Platform.OS === "ios" ? 35 : 56, // Hauteur standard iOS et Android
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 10 : 0, // Ajuste pour Android
  },
  backButton: {
    position: "absolute",
    left: 15, // Garde le bouton à gauche
    color: "#1e1e1e",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e1e1e",
  },
});

export default CustomHeader;
