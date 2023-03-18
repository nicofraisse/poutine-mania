import { useRouter } from "next/router";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goToHomepage = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-gray-700">
        404 - Page introuvable
      </h1>
      <div className="bg-gray-200 w-48 h-48 rounded-full flex items-center justify-center mb-8">
        <Image
          src="/poutinebw.png"
          width={128}
          height={128}
          alt="empty-poutine"
          className="opacity-40"
        />
      </div>
      <p className="text-base sm:text-lg mb-6 text-gray-600">
        Désolé, nous n'avons pas trouvé la page que vous recherchez.
      </p>
      <div>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-4"
          onClick={goBack}
        >
          Retourner
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
          onClick={goToHomepage}
        >
          Accueil
        </button>
      </div>
    </div>
  );
};

export default NotFound;
