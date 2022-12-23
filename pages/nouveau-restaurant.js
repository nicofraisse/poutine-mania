import RestaurantForm from "components/forms/Restaurant";
import { useRouter } from "next/router";
import { useCurrentUser } from "lib/useCurrentUser";
import Spinner from "../components/Spinner";

const CreateRestaurant = () => {
  const { push } = useRouter();
  const { currentUser, loading } = useCurrentUser();
  if (loading) return <Spinner />;
  if (!currentUser) {
    return (
      <div className="p-2 text-red-500">
        Vous devez être connecté(e) pour accéder à cette page
      </div>
    );
  }
  return (
    <div className="sm:w-[600px] py-2 px-4 sm:py-10 sm:px-16">
      <h1 className="my-3 sm:mt-4 sm:mb-5 font-black text-xl sm:text-2xl">
        Nouveau Restaurant
      </h1>
      <RestaurantForm type="create" isAdmin={!currentUser.isAdmin} />
    </div>
  );
};

export default CreateRestaurant;
