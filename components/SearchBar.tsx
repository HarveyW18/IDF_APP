import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GOOGLE_API_KEY } from "../../IDF_APP/app/config"; // ✅ Utilisation du fichier de config

const BASE_AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

interface SearchBarProps {
    placeholder: string;
    onSelect: (address: string) => void;
    value: string;
    label?: string; // Label optionnel (Départ / Arrivée)
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSelect, value, label }) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<{ place_id: string; description: string }[]>([]);
    const [focused, setFocused] = useState(false);

    /**
     * 🔎 Fait une requête à Google Places API pour obtenir des suggestions d'adresses.
     */
    const fetchSuggestions = async (text: string) => {
        if (!text) {
            setSuggestions([]);
            return;
        }

        const url = `${BASE_AUTOCOMPLETE_URL}?input=${encodeURIComponent(text)}&key=${GOOGLE_API_KEY}&types=geocode&language=fr`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.predictions) {
                setSuggestions(data.predictions.map((item: any) => ({
                    place_id: item.place_id,
                    description: item.description
                })));
            }
        } catch (error) {
            console.error("❌ Erreur API Google Places :", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.searchContainer, focused && styles.searchFocused]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        fetchSuggestions(text);
                        onSelect(text); // Met à jour la valeur dans le parent
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </View>

            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.place_id}
                    style={styles.suggestionsList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            activeOpacity={0.7}
                            onPress={() => {
                                onSelect(item.description);
                                setQuery(item.description);
                                setSuggestions([]);
                            }}
                        >
                            <Text style={styles.suggestionText}>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    searchFocused: {
        backgroundColor: "#FFFFFF",
        shadowOpacity: 0.2,
    },
    label: {
        fontSize: 12,
        color: "#007bff",
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    suggestionsList: {
        marginTop: 5,
        backgroundColor: "#FFF",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    suggestionItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    suggestionText: {
        fontSize: 16,
        color: "#444",
    },
});

export default SearchBar;
