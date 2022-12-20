import RestaurantForm from "components/forms/Restaurant";
import { useRouter } from "next/router";
import { useCurrentUser } from "lib/useCurrentUser";
import Spinner from "../../components/Spinner";

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
    <div className="w-[600px] py-10 px-16">
      <h1 className="mt-4 mb-5 font-black text-2xl">Nouveau Restaurant</h1>
      <RestaurantForm
        type="create"
        onSubmit={() => push("/admin/restaurants")}
        isAdmin={!currentUser.isAdmin}
      />
    </div>
  );
};

export default CreateRestaurant;
