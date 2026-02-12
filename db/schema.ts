import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["free", "pro", "business"]);
export const themeEnum = pgEnum("theme", [
  "minimal",
  "bold",
  "elegant",
  "playful",
  "corporate",
]);

// ─── JSONB Types ─────────────────────────────────────────────────────────────

export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: Record<string, unknown>;
}

export interface FormSchema {
  fields: FormField[];
}

export interface FormSettings {
  submitButtonText?: string;
  successMessage?: string;
  redirectUrl?: string;
  notifyOnSubmission?: boolean;
  notificationEmail?: string;
  closedMessage?: string;
  maxResponses?: number;
}

export interface ResponseMetadata {
  ip?: string;
  browser?: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
}

// ─── Better Auth Tables ──────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  // App-specific fields
  plan: planEnum("plan").notNull().default("free"),
  brandPrimaryColor: text("brand_primary_color"),
  brandSecondaryColor: text("brand_secondary_color"),
  logoUrl: text("logo_url"),
});

export const session = pgTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const account = pgTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ─── App Tables ──────────────────────────────────────────────────────────────

export const form = pgTable(
  "form",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Untitled Form"),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    schema: jsonb("schema")
      .$type<FormSchema>()
      .notNull()
      .default({ fields: [] }),
    theme: themeEnum("theme").notNull().default("minimal"),
    published: boolean("published").notNull().default(false),
    settings: jsonb("settings").$type<FormSettings>().notNull().default({}),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("form_user_id_idx").on(table.userId)],
);

export const response = pgTable(
  "response",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    formId: text("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),
    data: jsonb("data").notNull().default({}),
    metadata: jsonb("metadata").$type<ResponseMetadata>().default({}),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("response_form_id_idx").on(table.formId)],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  forms: many(form),
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const formRelations = relations(form, ({ one, many }) => ({
  user: one(user, { fields: [form.userId], references: [user.id] }),
  responses: many(response),
}));

export const responseRelations = relations(response, ({ one }) => ({
  form: one(form, { fields: [response.formId], references: [form.id] }),
}));

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;

export type Form = typeof form.$inferSelect;
export type NewForm = typeof form.$inferInsert;

export type Response = typeof response.$inferSelect;
export type NewResponse = typeof response.$inferInsert;
