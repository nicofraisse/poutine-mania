import { useEffect } from "react";
import { useRouter } from "next/router";

const OauthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.opener) {
      // Send a message to the original window with the URL
      window.opener.postMessage(
        {
          type: "oauth-callback",
          url: window.location.href,
        },
        window.location.origin
      );
      // Close the current window (the new window opened for authentication)
      window.close();
    } else {
      // If not in a new window, just redirect to the main page
      router.push("/");
    }
  }, [router]);

  return <div>Loading...</div>;
};

export default OauthCallback;
