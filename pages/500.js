import Image from "next/image";

const ServerError = ({ errorLog }) => {
  const encodedErrorLog = encodeURIComponent(errorLog);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-gray-700">
        500 - Erreur serveur
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
        Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.
      </p>
      <div>
        <a
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-4"
          href={`mailto:cyys100@gmail.com?subject=Problème à signaler&body=Erreur du serveur : ${encodedErrorLog}`}
        >
          Signaler un problème
        </a>
      </div>
      <div className="mt-6"></div>
      {errorLog && (
        <pre className="mt-4 bg-gray-200 p-4 rounded text-sm text-gray-700">
          {errorLog}
        </pre>
      )}
    </div>
  );
};

export default ServerError;
