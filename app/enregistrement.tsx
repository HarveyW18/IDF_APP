import { useLocalSearchParams, useRouter } from "expo-router";
import { SetStateAction, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import Modal from "react-native-modal";


const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Accepte tous types de fichiers
      });
  
      if (result.canceled) {
        console.log("Sélection annulée");
        return;
      }
  
      setFile(result); 
      console.log("Fichier sélectionné :", result);
    } catch (err) {
      console.error("Erreur lors du choix du fichier", err);
    }
  };

export default function Enregistrement() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Choisir");

  const handleSelect = (value: SetStateAction<string>) => {
    setSelectedValue(value);
    setIsVisible(false);
  };


  
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
            <Text style={styles.title}>Enregistrement</Text>

            <Text style={{ color: "#4894FE", fontSize: 16, marginTop: 30, fontWeight: "bold"}}>Vos informations :</Text>

            <View style={{  }}>
                <Text  style={{ fontSize: 16, marginTop: 30, flexDirection: "row", color: "#8696BB" }}>Nom :</Text>
                <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                </View>    
            </View>

            <View style={{  }}>
                <Text  style={{ fontSize: 16, marginTop: 20, flexDirection: "row", color: "#8696BB" }}>Prénom :</Text>
                <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                </View>    
            </View>

            <View style={{  }}>
                <Text  style={{ fontSize: 16, marginTop: 20, flexDirection: "row", color: "#8696BB" }}>Date de naissance :</Text>
                <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                </View>    
            </View>

            <View style={{ }}>
                <Text  style={{ fontSize: 16, marginTop: 20, flexDirection: "row", color: "#8696BB" }}>Adresse :</Text>
                <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                </View>    
            </View>

            <View style={{  }}>
                <Text  style={{ fontSize: 16, marginTop: 20, flexDirection: "row", color: "#8696BB" }}>Commune :</Text>
                <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                </View>    
            </View>

            <View style={{  }}>
                <Text  style={{ fontSize: 16, marginTop: 20, flexDirection: "row", color: "#8696BB" }}>Code postal :</Text>
                <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder=""
                />
                </View>    
            </View>

            <View style={styles.separator} />

            <Text  style={{ fontSize: 16, marginTop: 30, flexDirection: "row", color: "#8696BB" }}>Véuillez joindre votre pièce d’identité : </Text>

            <View style={{ alignItems: "center", marginTop: 20 }}>

                <TouchableOpacity
                    style={{
                    width: 250,
                    height: 80,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    backgroundColor: "#f9f9f9",
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                    onPress={pickDocument}
                >
                    <Ionicons name="cloud-upload-outline" size={30} color="black" />
                    <Text style={{ color: "#A0A0A0", fontSize: 14 }}>Charger un fichier</Text>
                </TouchableOpacity>

                {file && (
                    <Text style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
                    </Text>
                )}
                </View>

                <View style={styles.separator} />

                <Text  style={{ fontSize: 16, marginTop: 10, flexDirection: "row", color: "#8696BB" }}>Choisir son assistance : </Text>

                <TouchableOpacity style={styles.button} onPress={() => setIsVisible(true)}>
                    <Text style={styles.buttonText}>{selectedValue} ⏷</Text>
                </TouchableOpacity>

                {/* Modal (Menu déroulant) */}
                <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
                    <View style={styles.modal}>
                    <TouchableOpacity onPress={() => handleSelect("Choisir")} style={styles.option}>
                        <Text>Choisir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("BLND")} style={styles.option}>
                        <Text>BLND</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("DEAF")} style={styles.option}>
                        <Text>DEAF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("DPNA")} style={styles.option}>
                        <Text>DPNA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("WCHR")} style={styles.option}>
                        <Text>WCHR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("WCHS")} style={styles.option}>
                        <Text>WCHS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("WCHC")} style={styles.option}>
                        <Text>WCHC</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSelect("MAAS")} style={styles.option}>
                        <Text>MAAS</Text>
                    </TouchableOpacity>
                    </View>
                </Modal>

                <TouchableOpacity style={{ backgroundColor: "#4894FE", borderRadius: 20,  padding: 10, alignItems: "center", width: "50%", alignSelf: "flex-end", marginTop: 20, marginBottom: 100}} onPress={() => router.push("/bagages")} >
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
      overflow: 'scroll',
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
    searchBar: {
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 5,
        marginTop: 10,
        height: 35,
      },
      searchIcon: {
        marginRight: 10,
      },
      input: {
        flex: 1,
        fontSize: 16,
        width: 300,
      },
      separator: {
        height: 1, 
        backgroundColor: "#E0E0E0", 
        marginTop: 40, 
      },
      label: {
        fontSize: 16,
        marginBottom: 10,
        color: "#8696BB",
      },
      button: {
        backgroundColor: "#E0E0E0",
        padding: 10,
        borderRadius: 5,
        width: 200,
        alignItems: "center",
        marginBottom: 40,
        marginTop: 20,

      },
      buttonText: {
        fontSize: 16,
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
      menu: {
        position: "absolute", 
        bottom: 13,
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
    
})
const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      color: "black",
    },
    inputAndroid: {
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      color: "black",
    },
}


function setFile(result: DocumentPicker.DocumentPickerSuccessResult) {
    throw new Error("Function not implemented.");
}
