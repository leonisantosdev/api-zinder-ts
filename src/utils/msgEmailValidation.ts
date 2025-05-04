export const msgUserEmail = ({urlBase, route, token, msg}: {urlBase: string, route: string, token?: string, msg?: string }) => {
  return `
${msg}

${urlBase}${route}?token=${token}`
}
