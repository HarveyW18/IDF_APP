import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { useAuthViewModel } from "../app/viewmodels/authViewModel";
import { useRouter } from "expo-router";

export default function Home() {
  const { user, loading, handleLogout } = useAuthViewModel();
  const router = useRouter();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        {user ? `Bonjour, ${user.email}` : "Bienvenue dans mon app"}
      </Text>

      {!user ? (
        <>
          {/* Connexion pour les utilisateurs */}
          <Pressable
            onPress={() => router.push("/authuser")}
            style={{ backgroundColor: "#003366", padding: 10, borderRadius: 5, marginBottom: 10 }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Connexion Utilisateur</Text>
          </Pressable>

          {/* Connexion pour les agents */}
          <Pressable
            onPress={() => router.push("/authagent")}
            style={{ backgroundColor: "#FF5733", padding: 10, borderRadius: 5, marginBottom: 10 }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Connexion Agent</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable
            onPress={() => router.push("/views/client/Home")}
            style={{ backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginBottom: 10 }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>🏠 Page d'Accueil</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/views/client/SearchScreen")}
            style={{ backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginBottom: 10 }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>🔍 Rechercher un Trajet</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={{ backgroundColor: "#d9534f", padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>🚪 Déconnexion</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
