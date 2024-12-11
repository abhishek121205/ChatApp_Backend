import bcrypt from 'bcryptjs';

export const hashPassword = password => bcrypt.hashSync(password, 10);
