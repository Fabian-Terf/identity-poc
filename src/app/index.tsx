import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function Index() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("jwt").then(setToken);
  }, []);

  if (!token) {
    return <Redirect href="http://localhost:8081/auth/login?returnTo=http://localhost:8082" />;
  }

  return <Redirect href="/home" />;
}