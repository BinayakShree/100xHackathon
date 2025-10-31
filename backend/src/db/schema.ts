import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export const tourists = sqliteTable("tourists", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
