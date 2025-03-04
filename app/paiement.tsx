import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { SetStateAction, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import QRCodeModal from './qrcode';



export default function Paiement() {
    const { width, height } = Dimensions.get("window");
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);

    const [selectedValue, setSelectedValue] = useState("Choisir");
    const [qrValue, setQrValue] = useState('https://example.com');

  const handleGenerateQR = () => {
    setModalVisible(true);
  };

  
    return (
        <ScrollView>
      <View style={styles.container}>
        {/* Bouton de retour */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
  
        {/* Titre */}
        <Text style={styles.title}>Paiement</Text>

        <Text  style={{ fontSize: 18, marginTop: 30, flexDirection: "row", color: "#8696BB" }}>Veuillez procéder au paiement :</Text>

        <View style= {{ marginTop: 40, borderWidth: 1, padding: 30, alignSelf: "center", borderRadius: 10, borderColor: "#D9D9D9"}}>

           <View style={{ }}>
                      <Text style={{ fontSize: 16, color: "#8696BB" }}>Name : </Text>
                      <TouchableOpacity >
                          <TextInput placeholder="Value" style={ styles.input}></TextInput>
                      </TouchableOpacity>
           </View>
          
           <View style={{  marginTop: 20 }}>
                      <Text style={{ fontSize: 16, color: "#8696BB" }}>Card number : </Text>
                      <TouchableOpacity >
                          <TextInput placeholder="Value" style={ styles.input}></TextInput>
                      </TouchableOpacity>
           </View>
          
           <View style={{  marginTop: 20 }}>
                      <Text style={{ fontSize: 16, color: "#8696BB" }}>Expiration : </Text>
                      <TouchableOpacity >
                          <TextInput placeholder="Value" style={ styles.input}></TextInput>
                      </TouchableOpacity>
           </View>

           <View style={{  marginTop: 20, marginBottom: 30}}>
                      <Text style={{ fontSize: 16, color: "#8696BB" }}>CVC : </Text>
                      <TouchableOpacity >
                          <TextInput placeholder="Value" style={ styles.input}></TextInput>
                      </TouchableOpacity>
           </View>

           <TouchableOpacity style={{ position: "relative", marginBottom: 30, backgroundColor: "#FEB052", borderRadius: 10, alignItems: "center", padding: 10, width: 100, alignSelf: "center"}}  onPress={handleGenerateQR}>
                    <Text style={{ color: "white", fontSize: 16 }}>Payer</Text>
        </TouchableOpacity>
        <QRCodeModal visible={isModalVisible} onClose={() => setModalVisible(false)} qrValue={qrValue} />

          
        </View>


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
      input: {
        borderColor: "black",
        width: 250,
        borderRadius: 5,
        borderWidth: 0.5,
        alignItems: "center",
        padding: 5,
        marginTop:10,
        alignSelf: "center"
      }
    
}
);
