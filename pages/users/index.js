import Link from "next/link";
import React from "react";
import Spinner from "../../components/Spinner";
import { useGet } from "../../lib/useAxios";

const Users = () => {
  const { data: users, loading } = useGet("/api/users");
  if (loading) return <Spinner />;

  return (
    <div>
      {users.map((user) => (
        <div key={user._id} className="text-blue-600 hover:text-blue-400">
          <Link href={`/profil/${user.slug}`}>
            <a>{user.name}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Users;
