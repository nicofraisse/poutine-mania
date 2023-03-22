import { useRouter } from "next/router";
import React from "react";
import Button, { VariantColor } from "./Button";
import { useLoginForm } from "./context/LoginFormProvider";
import { useCurrentUser } from "lib/useCurrentUser";
import { Plus, PlusCircle } from "react-feather";

const LoginMessage = () => (
  <div className="px-4 sm:w-[380px] ">
    <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-slate-700 rounded borer">
      {/* <Info size={18} className='text-slate-700 inline mr-2' /> */}
      <b>Connectez-vous</b> pour ajouter un restaurant.
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
    <div className="bg-white mb-20 py-3 px-5 xs:py-4 border-t border-b flex text-center xs:text-left items-center justify-center flex-col xs:flex-row">
      <div>
        <div className="font-bold text-md text-slate-500 mr-4">
          Restaurant introuvable?
        </div>
        {/* <div className="text-slate-400 mt-1 mb-2 text-xs font-light">
          Contribuez à la communauté en ajoutant une poutinerie.
        </div> */}
      </div>
      <Button
        variant={VariantColor.light}
        size="sm"
        height="sm"
        className="min-w-[120px] text-light text-sm mx:mt-0"
        onClick={handleClickAdd}
      >
        <Plus className="mr-1 text-gray -ml-1" size={16} />
        Ajouter
      </Button>
    </div>
  );
};

export default RestaurantIntrouvable;
