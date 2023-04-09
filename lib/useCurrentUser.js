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

  useEffect(() => {
    // Load user from local storage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUpdatedUser(JSON.parse(savedUser));
    } else {
      setUpdatedUser(session?.user);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (session) {
        localStorage.setItem("currentUser", JSON.stringify(session.user));
        setUpdatedUser(session.user);
      } else {
        localStorage.removeItem("currentUser");
        setUpdatedUser(null);
      }
    }
  }, [session, loading]);

  return {
    currentUser: updatedUser,
    loading,
  };
};

export { useCurrentUser };
