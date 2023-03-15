import RestaurantForm from "components/forms/Restaurant";

const CreateRestaurant = () => {
  return (
    <div className="w-[600px] py-10 px-16">
      <h1 className="my-4 text-2xl">Modifier Restaurant</h1>
      <RestaurantForm type="update" />
    </div>
  );
};

export default CreateRestaurant;
