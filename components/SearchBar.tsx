import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HERE_API_KEY } from "../../IDF_APP/app/config";

interface SearchBarProps {
    placeholder: string;
    onSelect: (address: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSelect }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<{ id: string; address: { label: string } }[]>([]);

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
        <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 1, paddingBottom: 8 }}>
                <Ionicons name="search" size={24} color="black" />
                <TextInput
                    style={{ flex: 1, marginLeft: 8, fontSize: 18 }}
                    placeholder={placeholder}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        fetchSuggestions(text);
                    }}
                />
            </View>

            <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ padding: 12, borderBottomWidth: 1 }}
                        onPress={() => {
                            onSelect(item.address.label);
                            setQuery(item.address.label);
                            setSuggestions([]);
                        }}
                    >
                        <Text>{item.address.label}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default SearchBar;
