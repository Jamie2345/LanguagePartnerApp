import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useUserData = () => {
  const [validUser, setValidUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        const user = response.data?.user;

        if (user && user.nationality && user.languages.length > 1) {
          setValidUser(true); // true as the data is valid!
          setUser(user);
        } else {
          console.log("fail");
          setValidUser(false);
        }
      } catch (error) {
        console.log(error);
        setValidUser(false);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  return { user, validUser, loading };
};

export default useUserData;