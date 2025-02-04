import { pgTable, serial, text, timestamp, integer, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// Enhanced status enum for Kanban
export const statusEnum = pgEnum('status', [
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'done',
  'released'
]);

export const typeEnum = pgEnum('type', ['feature', 'bug', 'improvement']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: typeEnum('type').notNull(),
  status: statusEnum('status').notNull().default('backlog'),
  priority: priorityEnum('priority').notNull().default('medium'),
  votes: integer('votes').notNull().default(0),
  images: jsonb('images').$type<string[]>().default([]),
  labels: jsonb('labels').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  assignedTo: text('assigned_to'),
  dueDate: timestamp('due_date'),
});

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id).notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id).notNull(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  content: text('content').notNull(),
  images: jsonb('images').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert; 