import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Button from "./Button";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Menu,
  Search,
  User,
  X,
} from "react-feather";
import { useState, createRef, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import { useLoginForm } from "./context/LoginFormProvider";
import Image from "next/image";
import { Image as ClImage } from "components/Image";

import RestaurantSearchBar from "./RestaurantSearchBar";
import { useRouter } from "next/router";
import { useRestaurantSearch } from "./context/RestaurantSearchProvider";
import { toast } from "react-hot-toast";
import classNames from "classnames";
import Skeleton from "react-loading-skeleton";
import { TextShimmer } from "components/motion-primitives/text-shimmer.js";
import { motion } from "framer-motion";
import { LanguageSwitch } from "./LanguageSwitch";
import { useTranslation } from "next-i18next";

const Header = ({ toggleMobileSidebar }) => {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  const loading = status === "loading";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleRef = createRef();
  const headerSearchbarRef = useRef();
  const headerRef = useRef();
  const { push, pathname, query } = useRouter();
  const { openLogin } = useLoginForm();
  const { setSearchValue } = useRestaurantSearch();
  const currentUser = session?.user;

  const PAGE_PROPS = {
    "/noter": {
      url: "/",
      buttonText: t("header.backablePage.home"),
      hideSearch: true,
      hideRateButton: true,
      hideLogo: true,
    },
    "/restaurants/[id]": {
      url: "/restaurants",
      buttonText: t("header.backablePage.restaurants"),
      hideRateButton: true,
    },
    "/restaurants/[id]/noter": {
      url: query.fromList ? "/noter" : `/restaurants/${query.id}`,
      buttonText: query.fromList ? t("header.backablePage.restaurants") : "",
      hideSearch: true,
      hideRateButton: true,
      hideLogo: true,
    },
    "/nouveau-restaurant": {
      hideRateButton: isMobile,
    },
  };

  const isRestaurantListPage = pathname === "/restaurants";

  useEffect(() => {
    if (window?.innerWidth < 640) {
      setIsMobile(true);
    }
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 640);
    });
  }, []);

  useEffect(() => {
    if (showSearchBar && headerSearchbarRef.current) {
      headerSearchbarRef.current.querySelector("input").focus();
    }
  }, [showSearchBar]);

  useEffect(() => {
    if (pathname === "/") setShowSearchBar(false);
    if (headerSearchbarRef.current && pathname !== "/restaurants") {
      headerSearchbarRef.current.querySelector("input").value = "";
      setSearchValue("");
    }
  }, [pathname, setSearchValue]);

  const backablePage = PAGE_PROPS[pathname];

  const handleGoBack = () => {
    backablePage?.url ? push(backablePage.url) : history.back();
  };

  const handleSignout = async () => {
    try {
      const response = await signOut({ redirect: false, callbackUrl: "/" });

      if (response && response.url) {
        toast.success(t("toast.logout.success"));
        push(response.url);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(t("toast.logout.error"));
    }
  };
  const isHomepage = pathname === "/";

  const handleArrowClick = () => {
    window.scrollTo({
      top: headerRef.current.clientHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -40, opacity: 0.4 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        mass: 0.8,
        duration: 0.4,
      },
    },
  };

  return (
    <header
      className="relative max-w-screen md:w-auto bg-indigo-white"
      ref={headerRef}
    >
      <div
        className={classNames(
          "flex justify-between items-center px-4 z-10 py-3 gap-2 sm:gap-3",
          {
            "absolute top-0 left-0 w-full": isHomepage,
            "bg-neutral-50": !isHomepage,
          }
        )}
      >
        {backablePage && !showSearchBar && (
          <div
            className="flex items-center px-1 mr-4 cursor-pointer underline-offset-2 hover:underline text-gray-700 font-light hover:text-gray-900 transition duration-200"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-1" size={20} />
            {backablePage.buttonText}
          </div>
        )}
        <>
          <div className="flex items-center lg:hidden">
            {!backablePage && (
              <Menu
                className={classNames(
                  "mr-2 min-w-10 sm:mr-3 sm:min-w-12 cursor-pointer hover:opacity-70",
                  { "text-white": isHomepage }
                )}
                onClick={toggleMobileSidebar}
                size={28}
              />
            )}

            {!isHomepage && !(isMobile && showSearchBar) && !backablePage && (
              <div className="-mb-1 -ml-2 block select-none min-w-20">
                <Link legacyBehavior href="/">
                  <a>
                    <Image
                      alt="poutine-logo"
                      src="/poutine.png"
                      width={1.506 * 50}
                      height={50}
                      quality={1}
                    />
                  </a>
                </Link>
              </div>
            )}
          </div>
          {isHomepage ? (
            <div></div>
          ) : (
            (!isMobile || showSearchBar) &&
            !backablePage?.hideSearch && (
              <RestaurantSearchBar
                ref={headerSearchbarRef}
                onSubmit={() => setShowSearchBar(false)}
              />
            )
          )}
          {isMobile && showSearchBar && (
            <X
              className="w-8 mr-3 sm:w-16 text-gray-400"
              onClick={() => setShowSearchBar(false)}
            />
          )}
        </>

        {!(isMobile && showSearchBar) && (
          <nav
            className={classNames("flex items-center gap-2 sm:gap-3", {
              "pt-1": isHomepage,
            })}
          >
            {!backablePage?.hideSearch && !isHomepage && (
              <Button
                variant="light"
                size="sm"
                className="sm:hidden"
                onClick={() => {
                  setShowSearchBar(true);
                }}
                height="sm"
                width="sm"
              >
                <Search />
              </Button>
            )}

            {currentUser && !backablePage?.hideRateButton && (
              <Link legacyBehavior href="/noter" passHref>
                <Button
                  variant={isHomepage ? "transparent" : "light"}
                  height={isHomepage ? "smd" : "sm"}
                  width={isHomepage ? "smd" : "sm"}
                  href="/noter"
                >
                  <Edit3 size={22} />
                  <span
                    className={classNames("ml-2", {
                      "xs:hidden": !isRestaurantListPage,
                      "hidden sm:inline md:hidden": isRestaurantListPage,
                    })}
                  >
                    {t("button.rate")}
                  </span>
                  <span
                    className={classNames("ml-2 hidden", {
                      "xs:inline": !isRestaurantListPage,
                      "md:inline": isRestaurantListPage,
                    })}
                  >
                    {t("button.ratePoutine")}
                  </span>
                </Button>
              </Link>
            )}
            <LanguageSwitch isHomepage={isHomepage} />
            {loading && !currentUser ? (
              <Skeleton
                circle
                className="mr-4 lg:mr-5 z-20"
                width={44}
                height={44}
                containerClassName="flex"
              />
            ) : currentUser ? (
              <div className="relative z-50">
                <div
                  className="h-[44px] w-[44px] bg-gray-400 rounded-full cursor-pointer hover:brightness-110 transition duration-150 flex items-center justify-center shadow"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  ref={toggleRef}
                >
                  {currentUser.image ? (
                    <ClImage
                      alt="user-image"
                      src={currentUser.image}
                      className="rounded-full object-cover object-center h-full w-full"
                      quality={30}
                    />
                  ) : (
                    <User className="text-white" size={30} />
                  )}
                </div>
                <Dropdown
                  isOpen={dropdownOpen}
                  setIsOpen={setDropdownOpen}
                  toggleRef={toggleRef}
                >
                  <div
                    onClick={() => {
                      setTimeout(() => {
                        setDropdownOpen(false);
                      }, 100);
                    }}
                  >
                    <Link
                      legacyBehavior
                      href={`/profil/${currentUser.slug}`}
                      passHref
                    >
                      <div className="hover:bg-gray-100 rounded-t-lg px-3 py-2 text-gray-700 cursor-pointer">
                        {t("dropdown.myProfile")}
                      </div>
                    </Link>

                    <div
                      className="hover:bg-gray-100 px-3 py-2 rounded-b-lg text-gray-700 cursor-pointer"
                      onClick={handleSignout}
                    >
                      {t("dropdown.signOut")}
                    </div>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <>
                <div
                  className="h-[44px] w-[44px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center sm:hidden"
                  onClick={openLogin}
                  ref={toggleRef}
                >
                  <User className="text-white" size={30} />
                </div>
                <Button
                  variant={isHomepage ? "secondaryWhite" : "secondary"}
                  height={isHomepage ? "smd" : "sm"}
                  width={isHomepage ? "smd" : "sm"}
                  onClick={openLogin}
                  style={{ flexShrink: 0 }}
                  className="hidden sm:block"
                >
                  {t("button.login")}
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
      {isHomepage && (
        <div
          className="w-full h-screen sm:max-h-[440px] flex items-center justify-center bg-cover bg-center py-40 px-4"
          style={{
            background: `
      linear-gradient(
        rgba(0, 0, 0, 0.35),
        rgba(0, 0, 0, 0.6)
      ),
      url(https://res.cloudinary.com/dhqv0jl8c/image/upload/v1735904148/canadian_poutine_iStock.jpg_xgduq8.webp)
    `,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          <div
            className="absolute top-0 right-0 w-full h-full pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom left,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.2) 30%, rgba(0,0,0,0) 60%)",
            }}
          />
          <div
            className="arrow bounce cursor-pointer block sm:hidden"
            onClick={handleArrowClick}
          >
            <ChevronDown size={40} />
          </div>
          <motion.div
            className="flex flex-col items-center"
            variants={containerVariants}
            initial={"hidden"}
            animate="visible"
          >
            <motion.h1
              className="text-center text-3xl lg:text-4xl 2xl:text-5xl font-semibold"
              variants={itemVariants}
            >
              <TextShimmer
                as="span"
                waitDuration={2}
                duration={2.4}
                spread={5}
                baseColor="#ffffff"
                shimmerColor="#e9c367"
                textShadow="0px 1px 3px rgba(0,0,0,1)"
              >
                {t("hero.title")}
              </TextShimmer>
            </motion.h1>
            <motion.h2
              className="text-center text-xl mt-4"
              variants={itemVariants}
            >
              <TextShimmer
                as="span"
                waitDuration={2}
                duration={2.4}
                spread={0}
                baseColor="#ffffff"
                shimmerColor="#e9c367"
                textShadow="0px 1px 3px rgba(0,0,0,1)"
              >
                {t("hero.subtitle")}
              </TextShimmer>
            </motion.h2>
            <motion.div
              className="relative mt-7 mb-5 w-full sm:w-[500px] md:w-[600px] xl:w-[700px] mx-auto flex"
              variants={itemVariants}
            >
              <RestaurantSearchBar isBanner />
            </motion.div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
