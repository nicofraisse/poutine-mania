import axios from "axios";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useState, useEffect } from "react";
import { Trash, Edit } from "react-feather";
import Link from "next/link";
import toast from "react-hot-toast";
import Spinner from "components/Spinner";
import { format } from "date-fns";
import { getUrlQueryString } from "lib/getUrlqueryString";
import { ToggleSwitch } from "components/controls/ToggleSwitch";
import { useCurrentUser } from "lib/useCurrentUser";
import { formatCity, formatCountry } from "lib/formatAddress";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: currentUserLoading } = useCurrentUser();

  const { push, reload } = useRouter();

  useEffect(() => {
    axios
      .get(
        `/api/restaurants${getUrlQueryString({ sort: "createdAt", order: -1 })}`
      )
      .then(({ data }) => {
        setLoading(false);
        setRestaurants(data);
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const handleDelete = async ({ _id, name }) => {
    if (window.confirm(`Êtes-vous sûr(e) de vouloir supprimer "${name}?"`)) {
      await axios
        .delete(`/api/restaurants/${_id}/delete`)
        .then(() => {
          toast.success("Supprimé!");
          reload(window.location.pathname);
        })
        .catch((e) => toast.error(e.message));
    }
  };

  const handleApprove = async (id, approved) => {
    await axios
      .post(`/api/restaurants/${id}/approve`, { approved })
      .then(() => {
        toast.success(approved ? "Approved!" : "Unapproved!");
      })
      .catch((e) => toast.error(e.message));
  };

  if (loading || !restaurants) return <Spinner />;

  if (currentUser && !currentUser.isAdmin) {
    push("/");
    return <div></div>;
  }

  if (!currentUser && !currentUserLoading) push("/404");

  if (currentUser?.isAdmin)
    return (
      <div className="w-full min-h-screen-minus-navbar p-6 max-w-lg">
        <Link href="/nouveau-restaurant" passHref>
          <button className="px-4 py-2 bg-slate-700 text-white font-black text-sm mb-3 rounded ml-auto block">
            Créer un restaurant
          </button>
        </Link>

        <table className="border-collapse table-auto w-full text-sm">
          <thead>
            <tr>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left rounded-tl-lg">
                Approved
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Name
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Area
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Creator
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Creation date
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurants?.map((r) => (
              <tr
                key={r._id}
                className="hover:bg-slate-50 tansition-colors duration-100"
                onDoubleClick={() => push(`/restaurants/${r._id}`)}
              >
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  <ToggleSwitch
                    onChange={() => handleApprove(r._id, !r.approved)}
                    checked={r.approved}
                  />
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {r.name}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {formatCity(r)}, {formatCountry(r)}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {r.creator?.email || "?"}
                </td>

                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {r.createdAt &&
                    format(new Date(r.createdAt), "yyyy/MM/dd kk:mm")}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  <button
                    className="p-1 bg-gray-200 rounded shadow hover:bg-gray-100 mx-2"
                    onClick={() => push(`/restaurants/${r._id}/edit`)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="p-1 bg-gray-200 rounded shadow hover:bg-gray-100 mx-2"
                    onClick={() => handleDelete(r)}
                  >
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return <div></div>;
};

export default Restaurants;
