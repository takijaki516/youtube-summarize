import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt", { mode: "string" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "string" }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "string" }),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey().notNull(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "string" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
});
