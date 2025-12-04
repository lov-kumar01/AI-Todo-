import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { AppRouter } from "./router/AppRouter";

export const App = () => {
  const load = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    load(); // load token + user on refresh
  }, [load]);

  return <AppRouter />;
};
