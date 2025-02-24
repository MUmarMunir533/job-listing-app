import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  cookieName: "session",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }
}

export {};
