import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../components/useColorScheme'; // Ajuster ce chemin si nécessaire

export {
  // Gérer les erreurs de navigation via un composant ErrorBoundary.
  ErrorBoundary,
} from 'expo-router';

// Empêcher la splash screen de se cacher automatiquement avant le chargement des ressources.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Charger une police personnalisée
    ...FontAwesome.font, // Charger les icônes FontAwesome
  });

  // Gérer les erreurs de chargement des polices.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Masquer la splash screen une fois que les ressources sont chargées.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Afficher une page vide pendant le chargement des polices.
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme(); // Détecter le thème du système (clair ou sombre)

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Route pour la page d'accueil (ou par défaut) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Route pour afficher une page modale */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

        {/* Route pour la page de connexion utilisateur */}
        <Stack.Screen
          name="authuser"
          options={{
            headerShown: false,
          }}
        />

        {/* Route pour la page de connexion agent */}
        <Stack.Screen
          name="authagent"
          options={{
            headerShown: false,
          }}
        />

        {/* Route pour la page homr client */}
        <Stack.Screen
          name="HomeScreen"
          options={{
            headerShown: false,
          }}
        />


        {/* 🔹 Ajouter la page de recherche de trajets */}
        <Stack.Screen
          name="views/client/SearchScreen"
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="views/client/ResultsScreen"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
