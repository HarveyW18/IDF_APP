import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HERE_API_KEY } from "../../IDF_APP/app/config";

interface SearchBarProps {
    placeholder: string;
    onSelect: (address: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSelect }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<{ id: string; address: { label: string } }[]>([]);
    const [focused, setFocused] = useState(false);

    const fetchSuggestions = async (text: string) => {
        if (!text) {
            setSuggestions([]);
            return;
        }

        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(text)}&apiKey=${HERE_API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.items) {
                setSuggestions(data.items);
            }
        } catch (error) {
            console.error("Erreur API HERE :", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.searchContainer, focused && styles.searchFocused]}>
                <Ionicons name="search" size={22} color="#777" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        fetchSuggestions(text);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </View>

            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    style={styles.suggestionsList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            activeOpacity={0.7}
                            onPress={() => {
                                onSelect(item.address.label);
                                setQuery(item.address.label);
                                setSuggestions([]);
                            }}
                        >
                            <Text style={styles.suggestionText}>{item.address.label}</Text>
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
    icon: {
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
