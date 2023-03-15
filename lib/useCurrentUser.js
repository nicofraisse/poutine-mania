import { useSession } from "next-auth/client";

const useCurrentUser = () => {
  const [session, loading] = useSession();
  return { currentUser: session?.user, loading };
};

export { useCurrentUser };
