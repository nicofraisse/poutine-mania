import { useCurrentUser } from "lib/useCurrentUser";
import { useLoginForm } from "../components/context/LoginFormProvider";

const useRequireLogin = () => {
  const { openLogin } = useLoginForm();
  const { currentUser } = useCurrentUser();

  const requireLogin = (callback, message) => {
    if (!currentUser) {
      openLogin(message);
    } else {
      callback();
    }
  };

  return requireLogin;
};

export { useRequireLogin };
