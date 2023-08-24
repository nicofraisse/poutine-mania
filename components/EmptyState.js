import { useRouter } from "next/router";
import Button from "./Button";
import Image from "next/image";

export const EmptyState = ({ title, hideButton, rateCTA }) => {
  const { push } = useRouter();
  return (
    <div className="flex border-4 border-slate-200 mx-3 sm:mx-auto border-dashed rounded-xl w-full flex-col p-10 my-8 text-slate-600 items-center">
      <div className="bg-gray-200 w-36 h-36 rounded-full flex items-center justify-center">
        <Image
          src="/poutinebw.png"
          width={100}
          height={100}
          alt="empty-poutine"
          className="opacity-40"
        />
      </div>
      <div className="font-bold my-5">{title || "Aucune poutine trouvée"}</div>
      {!hideButton && (
        <Button
          width="sm"
          height="sm"
          className="py-1 px-3 bg-teal-500 text-white inlint-block"
          onClick={() => push(rateCTA ? "/noter" : "/restaurants")}
        >
          {rateCTA ? "Noter une poutine" : "Découvrir des poutines"}
        </Button>
      )}
    </div>
  );
};
