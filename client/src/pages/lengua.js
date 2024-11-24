import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Lengua() {
  const fetchProtected = async () => {
    try {
      const response = await axiosInstance.get("/api/protected");
      console.log(response);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Welcome to lengua.</h1>
      <button onClick={fetchProtected}>Send Request</button>
    </div>
  );
}
