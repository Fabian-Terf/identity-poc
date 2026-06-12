import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // ---------------------------
    // 1) WEB : lecture du token dans l’URL
    // ---------------------------
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");

      if (token) {
        localStorage.setItem("token", token);

        // Nettoyer l’URL
        window.history.replaceState({}, "", "/");

        router.replace("/home");
        return;
      }

      // Pas de token → redirection vers Identity Web
      const identityUrl = new URL("http://localhost:3000/login.html");
      identityUrl.searchParams.set("returnTo", window.location.origin);

      window.location.href = identityUrl.toString();
      return;
    }

    // ---------------------------
    // 2) MOBILE : deep linking
    // ---------------------------
    const handleDeepLink = async (event: { url: string }) => {
      const parsed = Linking.parse(event.url);
      let token = parsed.queryParams?.token;

      // Correction TypeScript : forcer en string
      if (Array.isArray(token)) {
        token = token[0];
      }

      if (typeof token === "string" && token.length > 0) {
        await SecureStore.setItemAsync("token", token);
        router.replace("/home");
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);

    // Si l’app a été ouverte via un lien
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);

  return null;
}
