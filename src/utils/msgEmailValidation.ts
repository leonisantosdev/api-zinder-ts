export const msgEmailValidation = (token: string) => {
  return `
Clique no link para verificar sua conta:

${process.env.BASE_URL}/verify-email?token=${token}`
}