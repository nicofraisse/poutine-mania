import { getProviders, signIn } from "next-auth/client";

export const signInNewWindow = async (
  providerId,
  options,
  newWindow = false
) => {
  // not working
  if (newWindow) {
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const providers = await getProviders();
    const provider = providers[providerId];

    if (provider) {
      const url = provider.signinUrl;
      window.open(
        url,
        "_blank",
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    }
  } else {
    signIn(providerId, options);
  }
};
