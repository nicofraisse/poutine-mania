import Link from "next/link";
import { signOut } from "next-auth/client";
import { useCurrentUser } from "lib/useCurrentUser";
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

const Header = ({ toggleMobileSidebar }) => {
  const { currentUser, loading } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleRef = createRef();
  const searchBarRef = useRef();
  const { push, pathname, query } = useRouter();
  const { openLogin, openSignup } = useLoginForm();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setSearchValue } = useRestaurantSearch();

  const BACKABLE_PAGE_PROPS = {
    "/noter": {
      url: "/top-poutines",
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
      searchBarRef.current.querySelector("input").focus();
    }
  }, [showSearchBar]);

  useEffect(() => {
    if (searchBarRef.current && pathname !== "/restaurants") {
      searchBarRef.current.querySelector("input").value = "";
      setSearchValue("");
    }
  }, [pathname, setSearchValue]);

  const backablePage = BACKABLE_PAGE_PROPS[pathname];

  const handleGoBack = () => {
    backablePage?.url ? push(backablePage.url) : history.back();
  };

  return (
    <header className="flex justify-between items-center h-[64px] max-w-screen md:w-auto bg-indigo-white pl-4 z-10 bg-slate-50">
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
              className="mr-2 min-w-10 sm:mr-3 sm:min-w-12 cursor-pointer hover:opacity-70"
              onClick={() => toggleMobileSidebar()}
              size={28}
            />
          )}

          {!(isMobile && showSearchBar) && !backablePage && (
            <div className="-mb-2 -ml-3 block select-none min-w-20">
              <Link href="/top-poutines">
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
        {(!isMobile || showSearchBar) && !backablePage?.hideSearch && (
          <RestaurantSearchBar
            ref={searchBarRef}
            onSubmit={() => setShowSearchBar(false)}
          />
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

            {loading ? (
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
                    {/* <div className='hover:bg-gray-100 px-3 py-2 text-gray-700 cursor-pointer'>
                        <Link href='/profile'>Paramètres</Link>
                      </div> */}
                    <div
                      className="hover:bg-gray-100 px-3 py-2 rounded-b-lg text-gray-700 cursor-pointer"
                      onClick={signOut}
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
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  ref={toggleRef}
                >
                  <User className="text-white" size={30} />
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
                    <div
                      className="hover:bg-gray-100 px-3 py-2 rounded-b-lg text-gray-700 cursor-pointer"
                      onClick={(e) => {
                        e.persist();
                        openLogin();
                      }}
                    >
                      Connexion
                    </div>
                    <div
                      className="hover:bg-gray-100 px-3 py-2 rounded-b-lg text-gray-700 cursor-pointer"
                      onClick={() => openSignup()}
                    >
                      Inscription
                    </div>
                  </div>
                </Dropdown>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
