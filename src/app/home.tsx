import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }
  return SecureStore.getItemAsync("token");
}

export default function Home() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();

      // Pas de token → retour vers Identity Web
      if (!token) {
        redirectToIdentity();
        return;
      }

      // Appel API sécurisé pour récupérer l'utilisateur
      try {
        const res = await fetch("http://localhost:5000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          redirectToIdentity();
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        redirectToIdentity();
      }
    })();
  }, []);

  function redirectToIdentity() {
    const identityLogin =
      "http://localhost:3000/login.html?returnTo=http://localhost:8081";

    if (Platform.OS === "web") {
      window.location.href = identityLogin;
    } else {
      Linking.openURL(identityLogin);
    }
  }

  async function handleLogout() {
    if (Platform.OS === "web") {
      localStorage.removeItem("token");
    } else {
      await SecureStore.deleteItemAsync("token");
    }

    const logoutUrl =
      "http://localhost:3000/logout.html?returnTo=http://localhost:8081";

    if (Platform.OS === "web") {
      window.location.href = logoutUrl;
    } else {
      await Linking.openURL(logoutUrl);
    }
  }

  if (!user) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user.firstName} 👋</Text>
      <Text style={styles.subtitle}>Vous êtes connecté au POC</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom complet</Text>
        <Text style={styles.value}>{user.firstName} {user.lastName}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>ID utilisateur</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
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
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#c0392b",
    paddingVertical: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
