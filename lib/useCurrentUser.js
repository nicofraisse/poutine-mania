// lib/useCurrentUser.js

import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

const useCurrentUser = () => {
  const [session, loading] = useSession();
  const [updatedUser, setUpdatedUser] = useState(null);

  useEffect(() => {
    if (updatedUser) {
      setUpdatedUser(null);
    }
  }, [updatedUser]);

  // Save user to local storage
  useEffect(() => {
    if (session?.user) {
      localStorage.setItem("currentUser", JSON.stringify(session.user));
    }
  }, [session]);

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUpdatedUser(JSON.parse(savedUser));
    }
  }, []);

  const refetchUser = async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    if (data && data.user) {
      setUpdatedUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
    }
  };

  return {
    currentUser: updatedUser || session?.user,
    loading,
    refetchUser,
  };
};

export { useCurrentUser };
