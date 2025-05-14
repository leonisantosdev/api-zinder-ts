export const generateRandomNumber = () => {
  const number = Math.floor(1000 + Math.random() * 100000).toString();
  return number;
};
