import Link from "next/link";
import { User } from "react-feather";
import { maxBy } from "lodash";
import { useCurrentUser } from "../../lib/useCurrentUser";
import { useGet } from "../../lib/useAxios";
import Spinner from "../Spinner";
import ProfileReviewCard from "../ProfileReviewCard";
import { Image } from "components/Image";

const PublicProfile = ({ user }) => {
  const { currentUser } = useCurrentUser();

  const { data: reviews } = useGet(`/api/users/${user?._id}/reviews`, {
    skip: !user,
  });

  if (!user || !reviews) return <Spinner />;

  return (
    <div className="py-10 px-2 md:px-0">
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col text-center sm:text-left sm:flex-row items-center sm:items-start justify-start mb-10 border bg-slate-50 p-5 pl-6 rounded-xl">
          {user.image ? (
            <Image
              alt="user-image"
              src={user.image}
              className="rounded-full w-20 h-20 object-cover object-center"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
              <User className="text-white" size={64} />
            </div>
          )}
          <div className="sm:pl-8 w-full">
            <div className="mb-2 mt-2 w-full items-center sm:justify-between flex flex-col sm:flex-row">
              <div className="font-black text-2xl">{user.name}</div>
              {user._id === currentUser?._id ? (
                <Link
                  className="text-base mx-3 px-4 py-1 rounded-lg text-gray-500 sm:-mb-1 hover:text-gray-700 flex"
                  href={`/users/${user._id}/edit`}
                >
                  Modifier
                </Link>
              ) : (
                // <button className='text-base mx-3 bg-blue-400 px-4 py-1 rounded-lg text-white -mb-1 inline-block'>
                //   Suivre
                // </button>
                ""
              )}
            </div>
            <div className="text-lg">
              {reviews.length > 0 ? (
                <span className="text-xl">🤓</span>
              ) : (
                <span className="text-xl">💤</span>
              )}{" "}
              {reviews.length} poutine
              {reviews.length > 1 && "s"} notée{reviews.length > 1 && "s"}{" "}
              {/*| 12 abonnés*/}{" "}
            </div>
            <div className="text-lg">
              {user.eatenlist?.length > 0 ? (
                <span className="text-xl">😋</span>
              ) : (
                <span className="text-xl">😢</span>
              )}{" "}
              {user.eatenlist.length} poutine
              {user.eatenlist.length > 1 && "s"} mangée
              {user.eatenlist.length > 1 && "s"} {/*| 12 abonnés*/}{" "}
            </div>
            {reviews.length > 0 && (
              <div className="text-lg mt-1">
                <span className="text-xl">❤️</span> Poutine préférée:
                <Link
                  href={`/restaurants/${
                    maxBy(reviews, "finalRating")?.restaurants[0]?._id
                  }`}
                >
                  <a
                    target="_blank"
                    className="text-gray-500 inline-block font-bold px-3 bg-indigo-100 rounded-full text-lg hover:text-gray-400 ml-2"
                  >
                    {maxBy(reviews, "finalRating")?.restaurants[0]?.name}
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* <div className='w-full flex font-bold'>
          <div
            onClick={() => setSelectedTab('favorite')}
            className={classNames(
              'py-2 px-5 text-lg rounded-full cursor-pointer flex-grow-1 flex items-center justify-center mr-3',
              {
                'bg-teal-400 font-bold text-white border-teal-400': selectedTab === 'favorite',
                'text-gray-400 border-gray-400 border bg-gray-50 hover:bg-gray-100':
                  selectedTab === 'all',
              }
            )}
          >
            Poutines préférées
          </div>
          <div
            onClick={() => setSelectedTab('all')}
            className={classNames(
              'py-2 px-5 text-lg rounded-full cursor-pointer flex-grow-1 flex items-center justify-center',
              {
                'bg-teal-400 font-bold text-white border-teal-400': selectedTab === 'all',
                'text-gray-400 border-gray-400 border bg-gray-50 hover:bg-gray-50':
                  selectedTab === 'favorite',
              }
            )}
          >
            Toutes les poutines notées
          </div> */}
        {/* </div> */}

        {reviews.map((review) => (
          <ProfileReviewCard
            review={review}
            key={review._id}
            userName={user.name}
          />
        ))}

        {/* <div
          className='border rounded my-2 p-6 text-gray-400 flex items-center cursor-pointer hover:bg-gray-50'
          onClick={() => setModalOpen(true)}
        >
          <Plus size={32} className='mr-4' />
          Ajouter une poutine
        </div> */}
      </div>
    </div>
  );
};

export default PublicProfile;
