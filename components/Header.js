import Link from "next/link";
import { signOut, useSession } from "next-auth/client";
import Button from "./Button";
import { ArrowLeft, Edit3, Menu, Search, User, X } from "react-feather";
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
import { BrandLogo } from "./BrandLogo";

const Header = ({ toggleMobileSidebar }) => {
  // const { currentUser, loading } = useCurrentUser();
  const [session, loading] = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleRef = createRef();
  const headerSearchbarRef = useRef();
  const { push, pathname, query } = useRouter();
  const { openLogin } = useLoginForm();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setSearchValue } = useRestaurantSearch();
  const currentUser = session?.user;

  const BACKABLE_PAGE_PROPS = {
    "/noter": {
      url: "/",
      buttonText: "Retour à l'accueil",
      hideSearch: true,
      hideRateButton: true,
      hideLogo: true,
    },
    "/restaurants/[id]": {
      url: "/restaurants",
      buttonText: "Tous les restaurants",
      hideRateButton: true,
    },
    "/restaurants/[id]/noter": {
      url: query.fromList ? "/noter" : `/restaurants/${query.id}`,
      buttonText: query.fromList ? "Noter un autre restaurant" : "",
      hideSearch: true,
      hideRateButton: true,
      hideLogo: true,
    },
  };

  useEffect(() => {
    if (window?.innerWidth < 640) {
      setIsMobile(true);
    }
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 640);
    });
  }, []);

  useEffect(() => {
    if (showSearchBar) {
      headerSearchbarRef.current.querySelector("input").focus();
    }
  }, [showSearchBar]);

  useEffect(() => {
    if (headerSearchbarRef.current && pathname !== "/restaurants") {
      headerSearchbarRef.current.querySelector("input").value = "";
      setSearchValue("");
    }
  }, [pathname, setSearchValue]);

  const backablePage = BACKABLE_PAGE_PROPS[pathname];

  const handleGoBack = () => {
    backablePage?.url ? push(backablePage.url) : history.back();
  };

  const handleSignout = () => {
    signOut({ redirect: true, callbackUrl: "/" }).then(() =>
      toast.success("Déconnexion réussie")
    );
  };

  const isHomepage = pathname === "/";

  return (
    <header className="relative max-w-screen md:w-auto bg-indigo-white">
      <div
        className={classNames(
          "flex justify-between items-center pl-4 z-10 py-3",

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
                onClick={() => toggleMobileSidebar()}
                size={28}
              />
            )}

            {!isHomepage && !(isMobile && showSearchBar) && !backablePage && (
              <div className="-mb-2 -ml-3 block select-none min-w-20">
                <Link href="/">
                  <a>
                    <Image
                      alt="poutine-logo"
                      src="/poutine.png"
                      width={1.506 * 50}
                      height={50}
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
          <nav>
            <div className="flex items-center">
              {!backablePage?.hideSearch && (
                <Button
                  variant="light"
                  size="sm"
                  className="mx-3 sm:hidden"
                  onClick={() => {
                    setShowSearchBar(true);
                  }}
                  height="sm"
                  width="sm"
                >
                  <Search />
                </Button>
              )}
              {!backablePage?.hideRateButton && (
                <Button
                  variant="light"
                  height="sm"
                  width="sm"
                  className="lg:ml-6 sm:w-52 sm:ml-2"
                  onClick={() => push("/noter")}
                >
                  <Edit3 className="xs:mr-2" />{" "}
                  <span className="hidden xs:block">Noter</span>
                  <span className="hidden sm:inline grow shrink-0 -ml-2">
                    &nbsp;une poutine
                  </span>
                </Button>
              )}

              {loading && !currentUser ? (
                <div className="animate-pulse flex items-center pointer-events-none">
                  <div className="relative mx-4 lg:mx-5 z-20">
                    <div className="h-[44px] w-[44px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center">
                      <User className="text-white" size={30} />
                    </div>
                  </div>
                </div>
              ) : currentUser ? (
                <div className="relative mx-4 lg:mx-5 z-20">
                  <div
                    className="h-[44px] w-[44px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    ref={toggleRef}
                  >
                    {currentUser.image ? (
                      <ClImage
                        alt="user-image"
                        src={currentUser.image}
                        className="rounded-full object-cover object-center h-full w-full"
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
                      <Link href={`/users/${currentUser._id}`} passHref>
                        <div className="hover:bg-gray-100 rounded-t-lg px-3 py-2 text-gray-700 cursor-pointer">
                          Mon profil
                        </div>
                      </Link>

                      <div
                        className="hover:bg-gray-100 px-3 py-2 rounded-b-lg text-gray-700 cursor-pointer"
                        onClick={handleSignout}
                      >
                        Déconnexion
                      </div>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="relative mx-4 lg:mx-5 z-20">
                  <div
                    className="h-[44px] w-[44px] bg-gray-400 rounded-full cursor-pointer hover:opacity-80 flex items-center justify-center"
                    onClick={() => openLogin()}
                    ref={toggleRef}
                  >
                    <User className="text-white" size={30} />
                  </div>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
      {isHomepage && (
        <div
          className="w-full h-screen sm:max-h-[440px] flex items-center justify-center bg-cover bg-center py-40 px-4 mb-6"
          style={{
            background: `
      linear-gradient(
        rgba(0, 0, 0, 0.25),
        rgba(0, 0, 0, 0.5)
      ),
      url(https://www.finedininglovers.com/sites/g/files/xknfdk626/files/styles/article_1200_800_fallback/public/2020-12/canadian_poutine%C2%A9iStock.jpg?itok=W6lexIHJ)
    `,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          <div className="flex flex-col items-center">
            <h1
              className="text-center text-3xl lg:text-4xl 2xl:text-5xl font-black text-white"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.6)" }}
            >
              {/* <div
                className="rounded mb-4 inline-block relative"
                style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.5)" }}
              >
                <div className="text-3xl font-black">
                  <span className="text-amber-400">POUTINE</span>
                  <span className="text-orange-400">MANIA</span>
                </div>
              </div>,  */}
              La quête de la poutine ultime.
            </h1>
            <div className="relative mt-7 mb-5 w-full sm:w-[500px] md:w-[600px] xl:w-[800px] mx-auto">
              <RestaurantSearchBar isBanner />
              {/* <Search className="absolute top-3 left-4 text-slate-500" /> */}
            </div>
            <div className="text-center">
              <Button width="smd" height="smd" className="mr-3 shadow-md">
                Rechercher
              </Button>
              <Button
                variant="secondary"
                width="smd"
                height="smd"
                className="bg-white shadow-md"
              >
                Surprends-moi
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
