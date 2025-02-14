import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Welcome to my app
      </Text>
      <Pressable
        onPress={() => router.push("/authuser")}
        style={{ backgroundColor: "#003366", padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Go to AuthUser</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/authagent")}
        style={{ backgroundColor: "#003366", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Go to AuthAgent</Text>
      </Pressable>
    </View>
  );
}
