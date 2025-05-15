import { compare, hash } from 'bcryptjs';
export async function hashPassword(password) {
    return hash(password, 10);
}
export async function verifyPassword(password, hash) {
    return compare(password, hash);
}
