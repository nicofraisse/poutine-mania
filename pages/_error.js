import ServerError from "./500";

function CustomError({ statusCode, serverError }) {
  if (statusCode === 500) {
    return <ServerError errorLog={serverError} />;
  }

  return <p>Une erreur est survenue: {statusCode}</p>;
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const serverError = err && err.message ? err.message : null;
  return { statusCode, serverError };
};

export default CustomError;
