import RestaurantForm from "components/forms/Restaurant";

const CreateRestaurant = () => {
  return (
    <div className="sm:w-[600px] py-2 px-4 sm:py-10 sm:px-16 pb-4">
      <h1 className="my-3 sm:mt-4 sm:mb-5 font-black text-xl sm:text-2xl">
        Modifier Restaurant
      </h1>
      <RestaurantForm type="update" />
    </div>
  );
};

export default CreateRestaurant;
