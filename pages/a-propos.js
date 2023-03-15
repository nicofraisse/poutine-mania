import React from "react";
import { Mail } from "react-feather";
import Button from "../components/Button";

const APropos = () => {
  return (
    <div className="text-center flex flex-col justify-center item-center h-screen-minus-navbar">
      <h1 className="-mt-5 mb-10 font-black text-4xl">À Propos</h1>
      <div className="max-w-2xl mx-auto mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
      <a href="mailto:info@nicolasfraisse.com">
        <Button variant="white" className="my-12 w-[128px] mx-auto">
          <Mail className="mr-2" />
          Contact
        </Button>
      </a>
      <div className="mb-4">© Poutine Mania | 2022</div>
    </div>
  );
};

export default APropos;
