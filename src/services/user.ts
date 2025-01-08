import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";

const JWT_SECRET_KEY =
  "8601330917d2c4789f2c2bf9b00f34b0a6c8057d675e6d426c5598f355b04f61";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static createUser(payload: CreateUserPayload) {
    try {
      const { firstName, lastName, email, password } = payload;

      if (!firstName || !email || !password) {
        throw new Error("All fields are required.");
      }

      const salt = randomBytes(32).toString("hex");
      const hashedPassword = UserService.generateHash(salt, password);
      return prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          salt,
        },
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  private static getuserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getuserByEmail(email);
    //checking if user exists
    if (!user) {
      throw new Error("User not found");
    }
    //hashing the password give by the user
    const usersHashedPassword = UserService.generateHash(user.salt, password);
    // Verifying if the password matches.
    if (usersHashedPassword !== user.password) {
      throw new Error("Incorrect Password");
    }

    //generating JWT token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY);
    return token;
  }
  public static decodeJWTToken(token: string) {
    return JWT.verify(token, JWT_SECRET_KEY);
  }
}

export default UserService;
