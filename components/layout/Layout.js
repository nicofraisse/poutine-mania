import { useTranslation } from "next-i18next";
import Header from "../Header";
import "react-responsive-modal/styles.css";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";

const SiteMapForSeo = () => {
  const { t } = useTranslation();
  return (
    <noscript>
      <nav aria-label={t("sitemap.navLabel")}>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          <li>
            <a href="/">{t("sitemap.home")}</a>
          </li>
          <li>
            <a href="/noter">{t("sitemap.rate")}</a>
          </li>
          <li>
            <a href="/restaurants">{t("sitemap.restaurants")}</a>
          </li>
          <li>
            <a href="/a-propos">{t("sitemap.about")}</a>
          </li>
        </ul>
      </nav>
    </noscript>
  );
};

export const Layout = (props) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const toggleMobileSidebar = () => setShowMobileSidebar(!showMobileSidebar);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) setShowMobileSidebar(false);
    });
  }, []);

  return (
    <div className="flex text-slate-700">
      <SiteMapForSeo />
      <Sidebar
        showMobileSidebar={showMobileSidebar}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      <div className="grow bg-neutral-50 min-h-screen">
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <main className="min-h-screen-minus-nav">{props.children}</main>
      </div>
    </div>
  );
};
