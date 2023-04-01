import { useRouter } from "next/router";
import Button from "./Button";

export const SurpriseButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    const response = await fetch("/api/restaurants/surprise");
    const restaurant = await response.json();

    router.push(`/restaurants/${restaurant._id}`);
  };

  return (
    <Button
      variant="secondary"
      width="smd"
      height="smd"
      className="bg-white shadow-md"
      onClick={handleClick}
    >
      Surprends-moi
    </Button>
  );
};
