export const msgUserEmail = ({ route, token, msg }) => {
    return `
${msg}

${process.env.BASE_URL}${route}?token=${token}`;
};
