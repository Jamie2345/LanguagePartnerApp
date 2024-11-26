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

        if (user && user?.nationality && user?.languages.length > 1) {
          setValidUser(true); // true as the data is valid!
        } else {
          console.log('fail');
          setValidUser(false);
        }
      } catch (error) {
        console.log(error);
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
