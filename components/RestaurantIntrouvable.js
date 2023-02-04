import { useRouter } from "next/router";
import React from "react";
import Button, { VariantColor } from "./Button";
import { useLoginForm } from "./context/LoginFormProvider";
import { useCurrentUser } from "lib/useCurrentUser";

const LoginMessage = () => (
  <div className="px-4 sm:w-[360px] ">
    <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-gray-700 rounded borer">
      {/* <Info size={18} className='text-gray-700 inline mr-2' /> */}
      <b>Connectez-vous</b> pour créer un restaurant.
    </div>
  </div>
);

const RestaurantIntrouvable = () => {
  const { currentUser } = useCurrentUser();
  const { openLogin } = useLoginForm();
  const { push } = useRouter();

  const handleClickAdd = () => {
    if (!currentUser) {
      openLogin(<LoginMessage />, "/nouveau-restaurant");
    } else {
      push("/nouveau-restaurant");
    }
  };

  return (
    <div className="mb-20 bg-white shadow-md py-4 px-3 xs:py-6 border rounded flex text-center xs:text-left items-center justify-between flex-col xs:flex-row">
      <div>
        <div className="font-black text-md mb-1 text-gray-900">
          Restaurant introuvable?
        </div>
        <div className="text-gray-400 text-sm font-light">
          Contribuez à la communauté en ajoutant une poutinerie.
        </div>
      </div>
      <Button
        variant={VariantColor.light}
        size="sm"
        height="sm"
        className="min-w-[180px] text-light text-sm mt-2 mx:mt-0"
        onClick={handleClickAdd}
      >
        Ajouter un restaurant
      </Button>
    </div>
  );
};

export default RestaurantIntrouvable;
