// pages/_error.js
import ServerError from "./500";

function CustomError({ statusCode, serverError }) {
  if (statusCode === 500) {
    return <ServerError errorLog={serverError} />;
  }

  // handle other errors here or return a default error component

  return <p>Une erreur est survenue: {statusCode}</p>;
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const serverError = err && err.message ? err.message : null;
  return { statusCode, serverError };
};

export default CustomError;
