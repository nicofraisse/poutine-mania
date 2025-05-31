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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: currentUserLoading } = useCurrentUser();
  const { push } = useRouter();

  useEffect(() => {
    axios
      .get("/api/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data);
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

  if (loading || !users) return <Spinner />;

  if (currentUser && !currentUser.isAdmin) {
    push("/");
    return <div></div>;
  }

  if (!currentUser && !currentUserLoading) push("/404");

  return (
    <div className=" min-h-screen-minus-navbar p-6 max-w-lg">
      <table className="border-collapse table-auto  text-sm overflow-x-auto">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

export const getStaticProps = withI18n();
