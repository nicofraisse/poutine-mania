import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [updatedUser, setUpdatedUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUpdatedUser(JSON.parse(savedUser));
    } else {
      setUpdatedUser(session?.user);
    }
  }, [session]);

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

const refetchCurrentUser = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export { useCurrentUser, refetchCurrentUser };
