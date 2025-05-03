import { customAlphabet } from "nanoid";

const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// 10 caractères alphanumériques
export const generateRef = customAlphabet(alphabet, 10);
