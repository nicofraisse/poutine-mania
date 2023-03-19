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

  const refetchUser = async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    if (data && data.user) {
      setUpdatedUser(data.user);
    }
  };

  return {
    currentUser: updatedUser || session?.user,
    loading,
    refetchUser,
  };
};

export { useCurrentUser };
