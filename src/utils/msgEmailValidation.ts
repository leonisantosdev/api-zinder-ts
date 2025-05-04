export const msgUserEmail = ({route, token, msg}: { route: string, token?: string, msg?: string }) => {
  return `
${msg}

${process.env.BASE_URL}${route}?token=${token}`
}
