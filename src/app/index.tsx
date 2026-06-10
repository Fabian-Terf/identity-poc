import * as Linking from "expo-linking";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

// 🔥 Abstraction Web/Mobile pour lire le token local
async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }
  return SecureStore.getItemAsync("token");
}

export default function Index() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 1️⃣ WEB : vérifier si le token est dans l’URL
    if (Platform.OS === "web") {
      const url = new URL(window.location.href);
      const tokenFromUrl = url.searchParams.get("token");

      if (tokenFromUrl) {
        // Stocker le token
        localStorage.setItem("token", tokenFromUrl);

        // Nettoyer l’URL
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url.toString());

        setToken(tokenFromUrl);
        return;
      }
    }

    // 2️⃣ MOBILE + WEB : lire le token local
    getToken().then(async (t) => {
      if (!t) {
        // Pas de token → redirection vers Identity
        await Linking.openURL(
          "http://localhost:8081/auth/login?returnTo=http://localhost:8082"
        );
        return;
      }

      setToken(t);
    });
  }, []);

  // 3️⃣ Attendre le token
  if (!token) return null;

  // 4️⃣ Token OK → redirection interne
  return <Redirect href="/home" />;
}
