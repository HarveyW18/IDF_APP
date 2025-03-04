import { useLocalSearchParams, useRouter } from "expo-router";
import { SetStateAction, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import DateTimePicker from "@react-native-community/datetimepicker";



export default function TrajetScreen() {
  const router = useRouter();
  const { departure = "Ma Position", arrival = "" } = useLocalSearchParams(); // Récupère les paramètres

  const [search, setSearch] = useState(arrival); 
  const [results, setResults] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate: SetStateAction<Date>) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };


  // Simuler des trajets disponibles
  const allResults = [
    {
      id: "1",
      name: "Trajet 1",
      route: [
        { type: "image", source: require("../assets/images/ligne-14.png") }, 
        { type: "image", source: require("../assets/images/bus286.png") }, 
        { type: "image", source: require("../assets/images/185_BUS_RATP.png") }
          ],      price: "4,30€",
      duration: "1 h 6 min",
      walk: "14 min",
    },
    {
      id: "2",
      name: "Trajet 2",
      route: [
        { type: "image", source: require("../assets/images/ligne-14.png") }, 
        { type: "image", source: require("../assets/images/métro7.png") }, 
          ],        price: "2,15€",
      duration: "1 h 8 min",
      walk: "35 min",
    },
    {
      id: "3",
      name: "Trajet 3",
      route: [
        { type: "image", source: require("../assets/images/ligne-14.png") }, 
        { type: "image", source: require("../assets/images/bus192.png") }, 
          ],       price: "4,30€",
      duration: "1 h 10 min",
      walk: "29 min",
    },
  ];

  // Filtrer les résultats en fonction de la recherche
  const handleSearch = (text: SetStateAction<string | string[]>) => {
    setSearch(text);
    if (text.length > 0) {
      const filteredResults = allResults.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults(allResults);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton de retour */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* Titre */}
      <Text style={styles.title}>Trajets</Text>

      {/* Affichage Départ et Arrivée */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Départ</Text>
        <Text style={styles.inputText}>{departure}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Arrivée</Text>
        <Text style={styles.inputText}>{arrival}</Text>
      </View>

        <View style={styles.separator} />

        <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
        <Text style={styles.paragraph}>Bus</Text>
        <Checkbox style={styles.checkbox} value={isChecked2} onValueChange={setChecked2} />
        <Text style={styles.paragraph}>Train</Text>
        <Checkbox style={styles.checkbox} value={isChecked3} onValueChange={setChecked3} />
        <Text style={styles.paragraph}>Avion</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.date}>Départ</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.value}>
          {date.toLocaleDateString()} à {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime" 
          onChange={handleChange}
        />
      )}
      </View>

    <Text style={styles.itinéraires}>Itinéraires</Text>

      {/* Liste des trajets filtrés */}
      <TouchableOpacity>
      <FlatList
  data={allResults}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (  
    <TouchableOpacity style={styles.trajetContainer} onPress={() => router.push( "/enregistrement" )}>
      <View style={styles.routeContainer}>
        {item.route.map((step, index) => (
          <View key={index} style={styles.routeStep}>
            {step.type === "text" ? ( 
              <Text style={styles.routeText}>{step.value}</Text>
            ) : (
              <Image source={step.source} style={styles.image} />
            )}
            
            {/* Ajoute la flèche sauf pour le dernier élément */}
            {index < item.route.length - 1 && (
              <Text style={styles.arrow}>→</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.infos}>
        <Text>Durée : {item.duration}</Text>
        <Text>Marche : {item.walk}</Text>
        <Text>Prix : {item.price}</Text>
      </View>
      <Text>19h01 -- 20h07</Text>

    </TouchableOpacity>
  )}
/>
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
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  closeButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    marginTop: 15, 
    flexDirection: "row",
    gap: 10

  },
  label: {
    color: "#4894FE",
    fontWeight: "bold",
    fontSize: 14,
  },
  inputText: {
    fontSize: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  trajetItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  trajetTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
 
  trajetContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    paddingBottom: 40
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5, 

  },
  routeStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  arrow: {
    fontSize: 16,
    marginHorizontal: 5, 
  },
  infos: {
    position: "absolute",
    right: 0,
    marginTop: 20
},
separator: {
    height: 1, 
    backgroundColor: "#E0E0E0", 
    marginVertical: 10, 
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  date: {
    color: "#8696BB",
    fontWeight: "bold",
    fontSize: 14,
  },
  itinéraires: {
    marginTop: 20,
    color: "#8696BB",
    fontSize: 16,
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
});
