import { Star, Compass, Award } from "react-feather";
import { useTranslation } from "next-i18next";

export const FeaturesIntro = () => {
  const { t } = useTranslation();
  return (
    <section className="mx-auto py-12 px-4 bg-gradient-to-r relative overflow-hidden">
      {/* <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400 opacity-20 rounded-full"></div>
      <div className="absolute top-1/2 -right-16 w-48 h-48 bg-amber-500 opacity-10 rounded-full"></div>
      <div className="absolute -bottom-10 left-1/4 w-28 h-28 bg-amber-300 opacity-20 rounded-full"></div> */}

      <div className="relative z-10 mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 text-center">
          {t("home.featuresIntro.title")}
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-amber-500 p-6 group w-full max-w-[460px] md:max-w-[358px]">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-4 mb-5 group-hover:bg-amber-300 transition-colors duration-300">
              <Star className="text-amber-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3 text-amber-900">
              {t("home.featuresIntro.feature1.title")}
            </h3>
            <p className="text-gray-600 text-center mb-5">
              {t("home.featuresIntro.feature1.description")}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-amber-500 p-6 group w-full max-w-[460px] md:max-w-[358px]">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-4 mb-5 group-hover:bg-amber-300 transition-colors duration-300">
              <Compass className="text-amber-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3 text-amber-900">
              {t("home.featuresIntro.feature2.title")}
            </h3>
            <p className="text-gray-600 text-center mb-5">
              {t("home.featuresIntro.feature2.description")}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-amber-500 p-6 group w-full max-w-[460px] md:max-w-[358px]">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-4 mb-5 group-hover:bg-amber-300 transition-colors duration-300">
              <Award className="text-amber-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3 text-amber-900">
              {t("home.featuresIntro.feature3.title")}
            </h3>
            <p className="text-gray-600 text-center mb-5">
              {t("home.featuresIntro.feature3.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
