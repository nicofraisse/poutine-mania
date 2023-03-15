import Link from "next/link";
import React from "react";

const SiteMapLink = ({ href, children }) => (
  <div className="text-blue-600 hover:text-blue-400">
    <Link href={href}>{children}</Link>
  </div>
);

const SiteMap = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <SiteMapLink href="/restaurants">Restaurant List</SiteMapLink>
      <SiteMapLink href="/users">User List</SiteMapLink>
    </div>
  );
};

export default SiteMap;
