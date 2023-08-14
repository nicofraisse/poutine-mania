import React from "react";
import { Mail } from "react-feather";
import Button from "../components/Button";
import Head from "next/head";

const APropos = () => {
  return (
    <>
      <Head>
        <title>À Propos - PoutineMania</title>
        <meta
          name="description"
          content={
            "Bienvenue sur la référence des amateurs de poutine! Ici, découvrez, évaluez et partagez vos poutines favorites dans votre quartier ou ailleurs."
          }
        />
      </Head>
      <div className="text-center flex justify-center items-center h-screen-minus-navbar">
        <div>
          <h1 className="-mt-5 mb-10 font-black text-4xl">À Propos</h1>
          <div className="max-w-2xl mx-auto bg-white py-5 px-6 -sm border rounded-md">
            <p className="text-left mb-4">
              Bienvenue sur la référence des amateurs de poutine! Ici, découvre,
              évalue et partage test poutines favorites dans ton quartier ou
              ailleurs.
            </p>
            <p className="text-left mb-4">
              De notre première bouchée à Montréal jusqu&apos;aux plus profondes
              contrées québécoises, nous sommes devenus de véritables passionnés
              de poutine et avons créé ce site pour vous aider à trouver votre
              prochaine expérience culinaire. Merci de nous rejoindre dans cette
              aventure gourmande!
            </p>
            <p className="text-left">
              Pour toutes <b>questions</b>,{" "}
              <b>suggestions d&apos;amélioration</b>,{" "}
              <b>problèmes à signaler</b>, ou si tu veux simplement discuter de
              poutine, n&apos;hésite pas à nous contacter en cliquant sur le
              bouton ci-dessous.
            </p>
            <a href="mailto:cyys100@gmail.com">
              <Button
                variant="white"
                className="mt-4 mb-1 w-[128px] mx-auto max-h-[56px]"
              >
                <Mail className="mr-2" />
                Contact
              </Button>
            </a>
          </div>

          <div className="mb-4 mt-12">© Poutine Mania | 2022-2023</div>
        </div>
      </div>
    </>
  );
};

export default APropos;
