import Link from "next/link";
import React from "react";
import Button from "../../components/Button";

const index = () => {
  return (
    <div className="p-6">
      <div className="text-2xl font-bold mb-4">Admin Panel</div>
      <div className="flex flex-wrap">
        <Link legacyBehavior passHref href="/admin/restaurants">
          <Button variant="secondary" height="sm" className="mr-2">
            Restaurants
          </Button>
        </Link>
        <Link legacyBehavior passHref href="/admin/users">
          <Button variant="secondary" height="sm">
            Users
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default index;
