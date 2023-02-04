import Header from "../Header";
import "react-responsive-modal/styles.css";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const Layout = (props) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        setShowMobileSidebar(false);
      }
    });
  }, []);
  return (
    <div className="flex">
      <Sidebar
        showMobileSidebar={showMobileSidebar}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      <div className="grow bg-slate-50 min-h-screen">
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <main className="min-h-screen-minus-nav">{props.children}</main>
      </div>
    </div>
  );
};

export default Layout;
