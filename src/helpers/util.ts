import bcrypt = require('bcrypt');
const saltRounds = 10;
 

export const hashPasswordHelper = async (palinPassword: string) =>{
  try {
    return await bcrypt.hash(palinPassword, saltRounds)
  } catch (error) {
    console.log(error)
  }
}

export const comparePasswordHelper = async (palinPassword: string, hashPassword: string) =>{
  try {
    return await bcrypt.compare(palinPassword, hashPassword);
  } catch (error) {
    console.log(error)
  }
}