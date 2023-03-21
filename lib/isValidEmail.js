export const isValidEmail = (email) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};
