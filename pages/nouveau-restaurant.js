import { RestaurantForm } from "components/forms/Restaurant";
import { useCurrentUser } from "lib/useCurrentUser";
import { Spinner } from "../components/Spinner";
import { withI18n } from "../lib/withI18n";
import { useTranslation } from "react-i18next";

const CreateRestaurant = () => {
  const { currentUser, loading } = useCurrentUser();
  const { t } = useTranslation();
  if (loading) return <Spinner />;
  if (!currentUser) {
    return (
      <div className="p-2 text-red-500">
        Vous devez vous connecter pour accéder à cette page
      </div>
    );
  }
  return (
    <div className="sm:w-[600px] py-2 px-4 sm:py-6 sm:px-8 bg-white my-2 lg:my-6 rounded-md mx-auto xl:ml-10 shadow-md">
      <h1 className="my-3 sm:mt-4 sm:mb-5 font-black text-xl sm:text-2xl">
        {t("restaurantForm.newRestaurantHeader")}
      </h1>
      <RestaurantForm type="create" isAdmin={!currentUser.isAdmin} />
    </div>
  );
};
export const getStaticProps = withI18n();

export default CreateRestaurant;
