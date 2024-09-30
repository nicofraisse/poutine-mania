import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import UserRanking from "../../../components/UserRanking";
import { useGet } from "../../../lib/useAxios";
import UserLastReviews from "components/UserLastReviews";
import { EmptyState } from "components/EmptyState";

const Tab = ({ isSelected, handleSelectTab, title, description }) => {
  return (
    <div
      className={classNames(
        "w-32 h-20 mr-2 cursor-pointer select-none z-0 flex flex-col justify-center items-center group",
        {
          "bg-white rounded-t border-t border-r border-l text-slate-600 font-black":
            isSelected,
          "bg-transparent border border-transparent text-slate-400 font-normal":
            !isSelected,
        }
      )}
      onClick={handleSelectTab}
    >
      <div className="text-center">
        <span className="text-2xl" style={{ fontSize: 28 }}>
          {title}
        </span>
        <div
          className={classNames("text-sm group-hover:text-slate-500", {
            "mt-[1px]": isSelected,
          })}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const User = () => {
  const { query } = useRouter();
  const { data: user } = useGet(`/api/users/${query.id}`, { skip: !query.id });
  const [selectedTab, handleSetSelectedTab] = useState(1);
  const { data: reviews, loading: reviewsLoading } = useGet(
    `/api/users/${query.id}/reviews`,
    { skip: !query.id }
  );

  const tabs = [
    {
      title: "🏅",
      description: "Classement",
    },
    {
      title: "✍️",
      description: "Derniers avis",
    },
  ];

  return (
    <div className="p-0 sm:p-10 w-full">
      <div className="max-w-md w-screen sm:w-auto mx-auto">
        <ProfileHeader user={user} />
        <div className="flex mt-3 -mb-[1px]">
          {tabs.map((props, i) => (
            <Tab
              key={i}
              isSelected={selectedTab === i + 1}
              handleSelectTab={() => handleSetSelectedTab(i + 1)}
              {...props}
            />
          ))}
        </div>
        <div
          className={classNames(
            "bg-white sm:p-5 sm:rounded-b rounded-r border",
            {
              hidden: selectedTab !== 1,
            }
          )}
        >
          {!reviewsLoading && reviews?.length === 0 ? (
            <EmptyState hideButton title="Aucune poutine mangée" />
          ) : (
            <UserRanking reviews={reviews} loading={reviewsLoading} />
          )}
        </div>
        <div
          className={classNames(
            "bg-white p-4 sm:p-5 border rounded-b rounded-r",
            {
              hidden: selectedTab !== 2,
            }
          )}
        >
          <UserLastReviews reviews={reviews} user={user} />
        </div>
      </div>
    </div>
  );
};

export default User;
