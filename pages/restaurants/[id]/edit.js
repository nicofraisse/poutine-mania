import { RestaurantForm } from "components/forms/Restaurant";
import { useCurrentUser } from "../../../lib/useCurrentUser";
import { Spinner } from "../../../components/Spinner";
import { useRouter } from "next/router";
import { withI18n } from "../../../lib/withI18n";

const EditRestaurant = () => {
  const { currentUser, loading } = useCurrentUser();
  const { push } = useRouter();
  if (loading) return <Spinner />;
  if (currentUser && !currentUser.isAdmin) {
    push("/restaurants");
  }
  return (
    <div className="sm:w-[600px] py-2 px-4 sm:py-10 sm:px-16 pb-4">
      <h1 className="my-3 sm:mt-4 sm:mb-5 font-black text-xl sm:text-2xl">
        Modifier Restaurant
      </h1>

      <RestaurantForm type="update" />
    </div>
  );
};
export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
export const getStaticProps = withI18n();

export default EditRestaurant;
