import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { useRouter } from "next/dist/client/router";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { upperFirst } from "lodash";
import { ToggleSwitch } from "components/controls/ToggleSwitch";
import { withI18n } from "../../lib/withI18n";
import Modal from "react-responsive-modal";
import { X } from "react-feather";
import AdminLayout from "../../components/AdminLayout";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState("");
  const { currentUser, loading: currentUserLoading } = useCurrentUser();
  const { push } = useRouter();

  useEffect(() => {
    axios
      .get("/api/users")
      .then(({ data }) => {
        setLoading(false);
        const sortedUsers = data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setUsers(sortedUsers);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          push("/");
        } else {
          console.error(err);
        }
      });
  }, []);

  const handleApprove = async (id, isAdmin) => {
    await axios
      .post(`/api/users/${id}/make-admin`, { isAdmin })
      .then(() => {
        toast.success(isAdmin ? "Made admin!" : "Unmade admin!");
      })
      .catch((e) => toast.error(e.message));
  };

  const handleOpenRestaurants = async (id, name) => {
    await axios
      .get(`/api/users/${id}/restaurants`)
      .then(({ data }) => {
        setRestaurants(data);
        setModalUser(name);
        setModalOpen(true);
      })
      .catch((e) => toast.error(e.message));
  };

  if (loading || !users) return <Spinner />;

  if (currentUser && !currentUser.isAdmin) {
    push("/");
    return <div></div>;
  }

  if (!currentUser && !currentUserLoading) push("/404");

  return (
    <AdminLayout activeTab="users">
      <div className="max-w-full overflow-x-auto">
        <table className="border-collapse table-auto text-sm w-full">
          <thead>
            <tr>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Admin
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Email
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Email Verified
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Provider
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Name
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Created At
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Reviews
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Eaten
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Watched
              </th>
              <th className="bg-slate-100 border-b font-medium p-4 pl-8 pb-3 text-slate-500 text-left">
                Restaurants Created
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50 tansition-colors duration-100"
                onDoubleClick={() => push(`/users/${user.slug}`)}
              >
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  <ToggleSwitch
                    onChange={() => handleApprove(user._id, !user.isAdmin)}
                    checked={user.isAdmin}
                  />
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500 max-w-60 truncate">
                  {user.email}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {user.emailVerified ? "✅" : "❌"}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500 max-w-60 truncate">
                  {user.connectedAccount
                    ? upperFirst(user.connectedAccount?.provider) || "?"
                    : "-"}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500 max-w-60 truncate">
                  {user.name}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {user.createdAt &&
                    format(new Date(user.createdAt), "yyyy/MM/dd kk:mm")}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {user.reviewCount}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {user.eatenlistCount}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {user.watchlistCount}
                </td>
                <td className="border-b border-slate-100 p-2 pl-8 text-slate-500">
                  {user.restaurantsCreatedCount > 0 ? (
                    <button
                      className="underline text-blue-600"
                      onClick={() => handleOpenRestaurants(user._id, user.name)}
                    >
                      {user.restaurantsCreatedCount}
                    </button>
                  ) : (
                    <span>{user.restaurantsCreatedCount}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        classNames={{ overlay: "customOverlay", modal: "customModal" }}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeIcon={<X />}
        blockScroll={false}
        center
      >
        <h2 className="text-lg font-bold mb-4">
          Restaurants created by {modalUser}
        </h2>
        <ul className="space-y-1">
          {restaurants.map((r) => (
            <li key={r._id} className="flex justify-between">
              <a
                href={`/restaurants/${r.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {r.name}
              </a>
              <span>{r.approved ? "✅" : "❌"}</span>
            </li>
          ))}
        </ul>
      </Modal>
    </AdminLayout>
  );
};

export default Users;

export const getStaticProps = withI18n();
