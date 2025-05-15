export const msgUserEmail = ({ urlBase, route, token, msg, }) => {
    return `
${msg}

${urlBase}${route}?token=${token}`;
};
