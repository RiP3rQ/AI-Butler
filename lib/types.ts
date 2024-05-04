import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { z } from "zod";

export type TransactionType = "income" | "expense";
export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };

export const MAX_DATE_RANGE_DAYS = 90;

export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(1, "Password is required"),
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe("Workspace Name")
    .min(1, "Workspace name must be min of 1 character"),
  logo: z.any(),
});

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe("Banner Image"),
});

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
