import { useState, useEffect, useLayoutEffect } from "react";

import axiosInstance from "../api/axiosInstance";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/auth/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.accessToken);
      } else {
        setToken(null);
      }
    };

    fetchToken();
  }, []);

  useLayoutEffect(() => {
    console.log("token", token);
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response; // if success just return
      },
      async (error) => {
        const originalRequest = error.config;

        // if got a 403 try use refresh to get new token
        if (
          error.response &&
          error.response.status === 403 &&
          !originalRequest._retry
        ) {
          console.log("Refreshing token...");
          originalRequest._retry = true; // stops infinite loop

          try {
            const refreshResponse = await fetch("/api/auth/refresh", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              const newAccessToken = data.accessToken;
              setToken(newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              return axiosInstance(originalRequest);
            } else {
              setToken(null);
            }
          } catch (err) {
            console.error("Failed to refresh token:", err);
            setToken(null);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup function to remove the interceptor on unmount
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token, axiosInstance]);

  if (token) {
    return children;
  } else if (token === null) {
    window.location.href = "/login";
  } else {
    return; // keep loading
  }
};

export default AuthProvider;
