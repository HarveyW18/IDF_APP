import { NativeStackScreenProps } from "@react-navigation/native-stack";

// 🔹 Liste des écrans et leurs paramètres
export type RootStackParamList = {
    SearchScreen: undefined;
    ResultsScreen: { depart: string; arrivee: string };
};

// 🔹 Type pour `ResultsScreen`
export type ResultsScreenProps = NativeStackScreenProps<RootStackParamList, "ResultsScreen">;
