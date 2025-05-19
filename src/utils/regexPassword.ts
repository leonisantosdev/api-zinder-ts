export const passwordRegexValidation = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error('Invalid Regex Password');
  }
};
