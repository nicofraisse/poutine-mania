import ReactLinkify from "react-linkify";

export const Linkify = ({ children }) => {
  const componentDecorator = (decoratedHref, decoratedText, key) => (
    <a target="blank" href={decoratedHref} key={key} className="text-sky-600">
      {decoratedText}
    </a>
  );

  return (
    <ReactLinkify componentDecorator={componentDecorator}>
      {children}
    </ReactLinkify>
  );
};
