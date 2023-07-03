import { useRouter } from "next/router";
import { useEffect } from "react";

function PoutineJesus() {
  const { push } = useRouter();

  useEffect(() => {
    push("/profil/poutine-jesus");
  }, []);

  return <></>;
}

export default PoutineJesus;
