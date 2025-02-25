import { useRouter, usePathname } from "expo-router";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname(); // 🔥 Récupérer la page actuelle

    const pages = [
        { route: "/views/client/Home", icon: "home", lib: Ionicons },
        { route: "/views/client/SearchScreen", icon: "bus-multiple", lib: MaterialCommunityIcons },
        { route: "/messages", icon: "comments", lib: FontAwesome },
        { route: "/profile", icon: "person-outline", lib: Ionicons },
    ];

    return (
        <View style={styles.container}>
            {pages.map((page) => {
                const isActive = page.route === pathname;
                const scaleValue = useRef(new Animated.Value(isActive ? 1.2 : 1)).current;

                useEffect(() => {
                    Animated.timing(scaleValue, {
                        toValue: isActive ? 1.2 : 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }, [isActive]);

                return (
                    <TouchableOpacity key={page.route} style={styles.navItem} onPress={() => router.push(page.route)}>
                        <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
                            {isActive && <View style={styles.activeBackground} />}
                            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                                <page.lib name={page.icon} size={24} color="white" />
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20, // Légèrement détaché du bas
        left: 20,
        right: 20,
        height: 70, // Augmente la hauteur de la navbar
        padding: 15,
        flexDirection: "row",
        backgroundColor: "#3C85FF",
        paddingVertical: 12,
        borderRadius: 50,
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 5, // Ombre pour effet flottant (Android)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5, // Ombre pour effet flottant (iOS)
    },
    navItem: {
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    activeBackground: {
        position: "absolute",
        width: 65, // Taille du cercle autour de l'icône
        height: 60,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Bleu clair avec transparence
        justifyContent: "center",
        alignItems: "center",
        top: -18, // Correction du placement vertical
        left: "50%",
        marginLeft: -33, // Centrage horizontal
    },
});

export default Navbar;
