import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  time,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

export const userRoleEnum = pgEnum("user_role", [
  "client",
  "barber",
  "admin",
]);

// Users (clients + barbers + admins)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").notNull().default("client"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Services offered (haircut, beard trim, etc.)
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Barber availability / working hours
export const barberSchedules = pgTable("barber_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  barberId: uuid("barber_id")
    .notNull()
    .references(() => users.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sun, 6=Sat
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  active: boolean("active").notNull().default(true),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id),
  barberId: uuid("barber_id")
    .notNull()
    .references(() => users.id),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  status: appointmentStatusEnum("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  clientAppointments: many(appointments, { relationName: "client" }),
  barberAppointments: many(appointments, { relationName: "barber" }),
  barberSchedules: many(barberSchedules),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

export const barberSchedulesRelations = relations(
  barberSchedules,
  ({ one }) => ({
    barber: one(users, {
      fields: [barberSchedules.barberId],
      references: [users.id],
    }),
  })
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(users, {
    fields: [appointments.clientId],
    references: [users.id],
    relationName: "client",
  }),
  barber: one(users, {
    fields: [appointments.barberId],
    references: [users.id],
    relationName: "barber",
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));
