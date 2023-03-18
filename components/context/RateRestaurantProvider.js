import { createContext, useContext, useState } from "react";
import { X } from "react-feather";
import Modal from "react-responsive-modal";
import { useCurrentUser } from "lib/useCurrentUser";
import { useLoginForm } from "./LoginFormProvider";
import { RateRestaurantNew } from "../forms/RateRestaurantNew";
import { useRouter } from "next/router";

const RateRestaurantContext = createContext({});

const LoginMessage = ({ restaurantName }) => (
  <div className="px-4 sm:w-[380px] ">
    <div className="py-2 px-3 my-2 bg-blue-100 border--200 text-gray-700 rounded borer">
      {/* <Info size={18} className='text-gray-700 inline mr-2' /> */}
      <b>Connectez-vous</b> pour évaluer la poutine de {restaurantName} !
    </div>
  </div>
);

export const RateRestaurantProvider = ({ children }) => {
  const [rateRestaurantOpen, setRateRestaurantOpen] = useState(false);
  const [preselectedRestaurant, setPreselectedRestaurant] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  const { currentUser } = useCurrentUser();
  const { openLogin } = useLoginForm();
  const { reload } = useRouter();

  const rateRestaurant = (restaurant, review) => {
    if (!currentUser) {
      openLogin(<LoginMessage restaurantName={restaurant.name} />);
    } else {
      setRateRestaurantOpen(true);
      setPreselectedRestaurant(restaurant);
      setExistingReview(review);
    }
  };

  return (
    <RateRestaurantContext.Provider value={{ rateRestaurant }}>
      <>
        {children}
        <Modal
          classNames={{
            overlay: "customOverlay",
            modal: "rateModal",
          }}
          open={rateRestaurantOpen}
          onClose={() => setRateRestaurantOpen(false)}
          closeIcon={<X />}
          center
        >
          <RateRestaurantNew
            onSubmit={(id) => {
              setRateRestaurantOpen(false);
              setTimeout(() => {
                reload();
              }, 1200);
            }}
            preselectedRestaurant={preselectedRestaurant}
            existingReview={existingReview}
          />
        </Modal>
      </>
    </RateRestaurantContext.Provider>
  );
};

export const useRateRestaurant = () => {
  return useContext(RateRestaurantContext);
};

export default RateRestaurantContext;
