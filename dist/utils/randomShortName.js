import { v4 as uuidv4 } from 'uuid';
export function generateShortUUIDUsername() {
    return `user_${uuidv4().slice(0, 8)}`;
}
