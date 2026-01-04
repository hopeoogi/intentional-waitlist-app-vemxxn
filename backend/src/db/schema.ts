import { pgTable, uuid, text, integer, timestamp, index, jsonb } from 'drizzle-orm/pg-core';

export const waitlistApplications = pgTable(
  'waitlist_applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    age: integer('age').notNull(),
    city: text('city').notNull(),
    provinceState: text('province_state').notNull(),
    country: text('country').notNull(),
    email: text('email').notNull().unique(),
    phoneNumber: text('phone_number'),
    lookingFor: text('looking_for').array().notNull().default([]),
    additionalInformation: text('additional_information'),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => [
    index('email_idx').on(table.email),
    index('status_idx').on(table.status),
    index('created_at_idx').on(table.createdAt),
  ]
);
