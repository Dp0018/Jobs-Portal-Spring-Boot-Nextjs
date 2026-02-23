"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { getItem } from "./local-storage-service";
import { setUser } from "@/modules/auth/server/user-slice";
import axios from "axios";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Hydrate the user state after initial render to safeguard SSR hydration matching
    const storedUser = getItem("user");
    if (storedUser) {
      store.dispatch(setUser(storedUser));
    }

    const reqInterceptor = axios.interceptors.request.use((config) => {
      const user = getItem("user");
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
