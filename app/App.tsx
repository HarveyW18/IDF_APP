import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigation/AuthNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import Paiement from "./paiement";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthNavigator />
        <Paiement />

      </NavigationContainer>
    </PaperProvider>
  );
}
