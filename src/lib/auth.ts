import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL as string],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      currency: {
        type: "string",
        defaultValue: "USD",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const defaultCategories = [
            { name: "Alimentación", icon: "utensils", color: "#10b981" },
            { name: "Transporte", icon: "car", color: "#3b82f6" },
            { name: "Vivienda", icon: "home", color: "#f59e0b" },
            { name: "Entretenimiento", icon: "play", color: "#8b5cf6" },
            { name: "Salud", icon: "heart", color: "#ef4444" },
            { name: "Suscripciones", icon: "credit-card", color: "#ec4899" },
            { name: "Ahorro", icon: "piggy-bank", color: "#06b6d4" },
            { name: "Otros", icon: "more-horizontal", color: "#64748b" },
          ];

          await prisma.category.createMany({
            data: defaultCategories.map((cat) => ({
              ...cat,
              userId: user.id,
            })),
          });
        },
      },
    },
    account: {
      create: {
        after: async (account) => {
          // If this is a social login, try to update the user image if missing
          const user = await prisma.user.findUnique({
            where: { id: account.userId },
          });

          if (user && !user.image) {
            // We can't easily get the image here from better-auth metadata in the hook
            // but Better Auth usually auto-fills the image if it's a new user.
            // If it's an EXISTING user linking a new account, we might need a different approach.
          }
        },
      },
    },
  },
});
