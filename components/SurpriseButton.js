import { useRouter } from "next/router";
import Button from "./Button";

export const SurpriseButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    const response = await fetch("/api/restaurants/surprise");
    const restaurant = await response.json();
    await router.push(`/restaurants/${restaurant.slug}`);
  };

  return (
    <Button
      variant="secondary"
      width="smd"
      height="smd"
      className="bg-white shadow-md"
      onClick={handleClick}
      type="button"
    >
      Surprends-moi
    </Button>
  );
};
