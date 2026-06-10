import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }
  return SecureStore.getItemAsync("token");
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      }
    })();
  }, []);

  if (!user) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user.firstName} 👋</Text>
      <Text style={styles.subtitle}>Vous êtes connecté à l’Identity POC</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom complet</Text>
        <Text style={styles.value}>{user.firstName} {user.lastName}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>ID utilisateur</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#E8F1FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#1B4F72",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cdd7e5",
  },
  label: {
    fontSize: 14,
    color: "#7a8ca3",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#0A3D62",
    fontWeight: "600",
  },
});
