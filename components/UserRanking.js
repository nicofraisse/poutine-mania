import Color from "color";
import React from "react";
import { ratingColors } from "../data/ratingColors";
import { useGet } from "../lib/useAxios";
import Spinner from "./Spinner";
import { meanBy, round, repeat } from "lodash";
import { MessageCircle } from "react-feather";
import { formatCity } from "../lib/formatAddress";
import Tooltip from "rc-tooltip";

const UserRanking = ({ userId }) => {
  const restaurants = [
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Ma Poule Mouillée",
      price: "$",
      category: "Restaurant",
      city: "Montreal",
      rating: 7,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4.3,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
    {
      name: "Poutine Pro",
      price: "$$",
      category: "Diner",
      city: "Montreal",
      rating: 4,
    },
  ];

  const { data } = useGet(`/api/users/${userId}/reviews`);

  if (!data) return <Spinner />;

  const reviewedRestaurants = data.map((review) => {
    return { ...review.restaurants[0], review };
  });
  console.log(reviewedRestaurants);

  const aggr = reviewedRestaurants
    .map((r1) => {
      const sameRestaurants = reviewedRestaurants.filter(
        (r2) => r2._id === r1._id
      );
      const nbReviews = sameRestaurants.length;
      return {
        ...r1,
        nbReviews,
        avgRating: meanBy(sameRestaurants, (r3) => r3.review.finalRating),
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating);

  console.log(aggr);

  return (
    <div>
      <table className="border-collapse table-auto w-full text-sm">
        <thead>
          <tr>
            <th className="bg-slate-50 border-b font-bold text-slate-400 text-left rounded-tl-lg"></th>
            <th className="bg-slate-50 border-b font-bold p-4  pl-0 pb-3 text-slate-400 text-left">
              Nom
            </th>
            <th className="bg-slate-50 border-b font-bold p-4  pl-0 pb-3 text-slate-400 text-left">
              Description
            </th>
            {/* <th className="bg-slate-50 border-b font-bold p-4  pl-0 pb-3 text-slate-400 text-left">
              Ville
            </th> */}
            {/* <th className="bg-slate-50 border-b font-bold p-4  pl-0 pb-3 text-slate-400 text-left">
              Prix
            </th> */}
            <th className="bg-slate-50 border-b font-bold p-4  pl-4 pb-3 text-slate-400 text-left w-32">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {aggr.map((r, i) => {
            console.log(r);
            return (
              <tr key={r._id}>
                <td className="border-b border-slate-100 p-3 pl-6 text-enter text-3xl text-stone-300 font-bold">
                  #{i + 1}
                </td>
                <td className="border-b border-slate-100 p-3 pl-0 text-base text-teal-600 font-bold">
                  {r.name}
                </td>
                <td className="border-b border-slate-100 p-3 pl-0 text-slate-500">
                  {r.categories[0]}
                  {r.succursales.length > 1 ? ", " : " à "}
                  {formatCity(r)}
                </td>
                {/* <td className="border-b border-slate-100 p-3 pl-0 text-slate-500">
                  {r.city}
                </td> */}
                {/* <td className="border-b border-slate-100 p-3 pl-0 text-slate-500">
                  <div className="bg-slate-400 px-2 rounded border inline-block text-white">
                    {repeat("$", r.priceRange)}
                  </div>
                </td> */}
                <td className="border-b border-slate-100 text-center flex">
                  <div
                    className="w-[4.5rem] h-9 my-3 flex items-center justify-center rounded shadow"
                    style={{
                      backgroundColor: Color(ratingColors[10 - i]).lighten(0),
                    }}
                  >
                    <span className="font-black text-xl text-slate-600">
                      {round(r.avgRating, 1)}
                    </span>
                    <span className="text-slate-500 ml-[2px] block -mb-[2px]">
                      /10
                    </span>
                  </div>
                  {r.nbReviews > 1 && (
                    <div className="select-none ml-3 border-b border-slate-100 p-3 pl-0 text-slate-300 hover:text-slate-400 flex items-center justify-center">
                      {/* <MessageCircle size={16} className="mr-[1px]" /> */}
                      <Tooltip
                        placement="top"
                        trigger={["hover"]}
                        overlay={<div>Basé sur {r.nbReviews} notes</div>}
                      >
                        <div>({r.nbReviews})</div>
                      </Tooltip>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserRanking;
