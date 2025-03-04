import { router, useLocalSearchParams, useRouter } from "expo-router";
import { SetStateAction, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";



export default function Bagages() {
    const { width, height } = Dimensions.get("window");
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Choisir");

    const handleSelect = (value: SetStateAction<string>) => {
      setSelectedValue(value);
      setIsVisible(false);
    };

    const [selectedBaggageCount, setSelectedBaggageCount] = useState(0);
    const [selectedBaggageWeights, setSelectedBaggageWeights] = useState({}); 
    const [isBaggageModalVisible, setBaggageModalVisible] = useState(false);
    const [isWeightModalVisible, setWeightModalVisible] = useState(false);
    const [currentBag, setCurrentBag] = useState(null); 

    const handleSelectBaggageCount = (value: string) => {
    setSelectedBaggageCount(parseInt(value, 10));
    setBaggageModalVisible(false);
    };
  
  
    return (
        <ScrollView>
      <View style={styles.container}>
        {/* Bouton de retour */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
  
        {/* Titre */}
        <Text style={styles.title}>Dépots des bagages</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: "#8696BB" }}>Nombre de bagages : </Text>
            <TouchableOpacity style={styles.button} onPress={() => setBaggageModalVisible(true)}>
                <Text style={styles.buttonText}>{selectedBaggageCount} ⏷</Text>
            </TouchableOpacity>
       </View>

            {/* Modal pour choisir le nombre de bagages */}
            <Modal isVisible={isBaggageModalVisible} onBackdropPress={() => setBaggageModalVisible(false)}>
            <View style={styles.modal}>
                {[...Array(11).keys()].map((num) => (
                <TouchableOpacity key={num} onPress={() => handleSelectBaggageCount(num.toString())} style={styles.option}>
                    <Text>{num}</Text>
                </TouchableOpacity>
                ))}
            </View>
            </Modal>

    <View style={styles.separator} />

    {selectedBaggageCount > 0 && (
      <View>
        {Array.from({ length: selectedBaggageCount }, (_, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: "#8696BB" }}>Bagage {index + 1} : </Text>

            <TouchableOpacity style={styles.button}  >
                <TextInput style={styles.input} placeholder="Poids"  />            
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} >
                <TextInput style={styles.input} placeholder="Couleur"  />            
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}

        <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.modal}>
        <TouchableOpacity onPress={() => handleSelect("1")} style={styles.option}>
                <Text>Poids</Text>
            </TouchableOpacity>
            {[...Array(11).keys()].map((num) => (
            <TouchableOpacity key={num} onPress={() => handleSelect(num.toString())} style={styles.option}>
                <Text>{num}</Text>
            </TouchableOpacity>
            ))}
        </View>
        </Modal>

        <TouchableOpacity style={{ position: "relative", marginBottom: 100, right: 20, backgroundColor: "#4894FE", borderRadius: 20, alignItems: "center", padding: 10, width: "50%", alignSelf: "flex-end"}} onPress={() => router.push("/paiement")} >
                    <Text style={{ color: "white", fontSize: 16 }}>Suivant</Text>
        </TouchableOpacity>

   <View style={styles.menu}>
            <Image
            source={require("../assets/images/home.png")}
            style={styles.icone}
            />
             <Image
            source={require("../assets/images/commute.png")}
            style={styles.icone2}
            />
                <Image
            source={require("../assets/images/message.png")}
            style={styles.icone2}
            />
                <Image
            source={require("../assets/images/Frame 3.png")}
            />
  
          </View>
        </View>
        </ScrollView>
    );
  }
            
// Styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingTop: 60,
      minHeight: Dimensions.get("window").height,
    },
    closeButton: {
      position: "absolute",
      top: 60,
      left: 20,
      zIndex: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    menu: {
        position: "absolute", 
        bottom: 30,
        left: 20, 
        right: 20, 
        alignItems: "flex-end",
        backgroundColor: "#4894FE",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-around", 
      },
      icone: {
        margin: 10
      },
      icone2: {
        margin: 11
      },
      button: {
        backgroundColor: "#E0E0E0",
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: "center",
        marginBottom: 40,
        marginTop: 30,
        marginLeft: 10

      },
      buttonText: {
        fontSize: 16,
        color: "#4894FE",
      },
      modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
      },
      option: {
        padding: 10,
        width: 100,
        alignItems: "center",
      },
      separator: {
        height: 1, 
        backgroundColor: "#E0E0E0", 
        marginVertical: 10, 
      },
      input: {
        color: "#4894FE",
      }
}
);
