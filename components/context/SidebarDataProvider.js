import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../../lib/useCurrentUser";

const SidebarDataContext = createContext({});

export const SidebarDataProvider = ({ children }) => {
  const { currentUser } = useCurrentUser();

  const [sidebarEatenlistAmount, setSidebarEatenlistAmount] = useState(null);
  const [sidebarWatchlistAmount, setSidebarWatchlistAmount] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setSidebarEatenlistAmount(currentUser.eatenlist?.length || 0);
      setSidebarWatchlistAmount(currentUser.watchlist?.length || 0);
    }
  }, [currentUser]);

  return (
    <SidebarDataContext.Provider
      value={{
        sidebarEatenlistAmount,
        setSidebarEatenlistAmount,
        sidebarWatchlistAmount,
        setSidebarWatchlistAmount,
      }}
    >
      {children}
    </SidebarDataContext.Provider>
  );
};

export const useSidebarData = () => {
  return useContext(SidebarDataContext);
};

export default SidebarDataContext;
