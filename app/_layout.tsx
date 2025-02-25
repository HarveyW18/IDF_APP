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
      <Stack 
        screenOptions={{ headerShown: false }}  // 🔥 Supprime l'en-tête globalement
      >
        {/* ✅ Pages sans en-tête */}
        <Stack.Screen name="index" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="authuser" />
        <Stack.Screen name="authagent" />
        <Stack.Screen name="views/client/HomeScreen" />

        {/* ✅ Pages AVEC en-tête */}
        <Stack.Screen 
          name="views/client/SearchScreen"
          options={{
            headerShown: true, 
            title: "Recherche",
            headerStyle: { backgroundColor: "#3C85FF" },  // 🎨 Style personnalisé de l'en-tête
            headerTintColor: "white",  // 🖌️ Couleur du texte de l'en-tête
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
