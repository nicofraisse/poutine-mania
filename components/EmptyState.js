import { useRouter } from "next/router";
import Button from "./Button";
import Image from "next/image";

export const EmptyState = ({ title, hideButton }) => {
  const { push } = useRouter();
  return (
    <div className="flex flex-col p-10 my-8 text-slate-600 items-center mx-auto">
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
          onClick={() => push("/restaurants")}
        >
          Découvrir des poutines
        </Button>
      )}
    </div>
  );
};
