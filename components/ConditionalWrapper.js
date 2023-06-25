const ConditionalWrapper = ({ wrapper, condition, children }) => {
  if (wrapper && !!condition) {
    return wrapper(children);
  }
  return children;
};

export default ConditionalWrapper;
