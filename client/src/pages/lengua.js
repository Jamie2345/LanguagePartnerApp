import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { redirect } from "react-router-dom";

export default function Lengua() {
  const [validUser, setValidUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        const user = response.data?.user;
        console.log(user);
        if (user && user.interests && user.nationality) {
          setValidUser(true);
        } else {
          setValidUser(false);
        }
      } catch (error) {
        setValidUser(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProtected();
  }, []);

  if (loading) return;
  else if (validUser) {
    return (
      <div>
        <h1>Welcome to lengua.</h1>
      </div>
    );
  } else window.location.href = "/onboarding";
}
