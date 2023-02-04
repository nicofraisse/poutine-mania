import React from "react";

const ProfileStats = () => {
  return (
    <div className="text-center flex flex-col border rounded bg-white w-full justify-between py-5 px-8">
      <div className="my-4">
        <div className="font-black text-slate-700 text-2xl">❤️ Poutine Pro</div>
        <div className="text-sm text-slate-500">Poutine Préférée</div>
      </div>
      <div className="my-4">
        <div className="font-black text-slate-700 text-2xl">✍️ 5</div>
        <div className="text-sm text-slate-500">Poutines notées</div>
      </div>
      <div className="my-4">
        <div className="font-black text-slate-700 text-2xl">😋 9</div>
        <div className="text-sm text-slate-500">Poutines mangées</div>
      </div>
    </div>
  );
};

export default ProfileStats;
