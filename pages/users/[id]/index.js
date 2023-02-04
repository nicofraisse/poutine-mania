import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { EatenList } from "../../../components/profile/EatenList";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileStats from "../../../components/profile/ProfileStats";
import PublicProfile from "../../../components/profile/PublicProfile";
import Spinner from "../../../components/Spinner";
import { useGet } from "../../../lib/useAxios";

const User = () => {
  const { query } = useRouter();
  const { data } = useGet(`/api/users/${query.id}`, { skip: !query.id });
  console.log(query.id, data);
  const [selectedTab, setSelectedTab] = useState(1);

  if (!data) return <Spinner />;

  const tabs = ["Poutines Mangées", "Avis"];
  return (
    <div className="p-10 w-full">
      {/* <PublicProfile user={data} /> */}
      <div className="flex items-start 3xl:justify-evenly">
        <div className="max-w-md">
          <ProfileHeader user={data} />
          <div className="flex mt-3 -mb-[1px]">
            {tabs.map((tab, i) => (
              <div
                key={i}
                className={classNames("py-2 px-4 mr-2", {
                  "bg-white text-slate-700 border-t border-r border-l rounded-t":
                    selectedTab === i + 1,
                  "text-slate-400 ": selectedTab !== i + 1,
                })}
              >
                {tab}
              </div>
            ))}
          </div>
          <EatenList userId={query.id} />
        </div>

        <div className="ml-12 h-screen">
          <div className="sticky top-12">{/* <ProfileStats /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default User;
