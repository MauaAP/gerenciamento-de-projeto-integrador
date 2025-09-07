import bcrypt from "bcrypt";

export class Encrypt {
  static async hashPassword(password: string): Promise<string> {
    const salt = process.env.ENCRYPT_KEY || await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
