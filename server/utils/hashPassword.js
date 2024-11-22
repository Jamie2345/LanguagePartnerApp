import bcrypt from "bcrypt";

export default async function saltHashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(`salt: ${salt}`);
    console.log(`hash: ${hash}`);
    return hash;
  } catch (error) {
    throw new Error(`error hashing: ${error.message}`);
  }
}
