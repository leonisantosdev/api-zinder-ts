export const passwordRegexValidation = (userData) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(userData.password)) {
        throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, e um caractere especial.");
    }
};
