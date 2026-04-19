import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*                               BETTER AUTH                                  */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	role: text("role").default("employee").notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
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
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* -------------------------------------------------------------------------- */
/*                               CLIENTS                                      */
/* -------------------------------------------------------------------------- */

export const clients = pgTable("clients", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	phone: text("phone"),
	address: text("address"),
	userId: text("user_id").notNull().references(()=>user.id,{onDelete:"cascade"}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                               PRODUCTS                                     */
/* -------------------------------------------------------------------------- */

export const products = pgTable("products", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	price: numeric("price").notNull(),
	taxRate: numeric("tax_rate"),
	unit: text("unit"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                               QUOTATIONS                                   */
/* -------------------------------------------------------------------------- */

export const quotations = pgTable("quotations", {
	id: text("id").primaryKey(),
	quotationNumber: text("quotation_number").notNull(),
	clientId: text("client_id")
		.notNull()
		.references(() => clients.id),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	status: text("status").default("draft").notNull(),
	subtotal: numeric("subtotal"),
	tax: numeric("tax"),
	discount: numeric("discount"),
	total: numeric("total"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                               QUOTATION ITEMS                              */
/* -------------------------------------------------------------------------- */

export const quotationItems = pgTable("quotation_items", {
	id: text("id").primaryKey(),
	quotationId: text("quotation_id")
		.notNull()
		.references(() => quotations.id, { onDelete: "cascade" }),
	productId: text("product_id")
		.notNull()
		.references(() => products.id),
	quantity: integer("quantity").notNull(),
	price: numeric("price").notNull(),
	tax: numeric("tax"),
	total: numeric("total"),
});

/* -------------------------------------------------------------------------- */
/*                                INVOICES                                    */
/* -------------------------------------------------------------------------- */

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  quotationId: text("quotation_id"),
  clientId: text("client_id"),
  customerName: text("customer_name"),
  phone: text("phone"),
  userId: text("user_id").notNull(),
  status: text("status").notNull().default("pending"),
  subtotal: numeric("subtotal").notNull(),
  tax: numeric("tax").notNull(),
  discount: numeric("discount").default("0"),
  total: numeric("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


/* -------------------------------------------------------------------------- */
/*                               INVOICE ITEMS                                */
/* -------------------------------------------------------------------------- */

export const invoiceItems = pgTable("invoice_items", {
	id: text("id").primaryKey(),
	invoiceId: text("invoice_id")
		.notNull()
		.references(() => invoices.id, { onDelete: "cascade" }),
	productId: text("product_id")
		.notNull()
		.references(() => products.id),
	quantity: integer("quantity").notNull(),
	price: numeric("price").notNull(),
	tax: numeric("tax"),
	total: numeric("total"),
});

/* -------------------------------------------------------------------------- */
/*                                PAYMENTS                                    */
/* -------------------------------------------------------------------------- */

export const payments = pgTable("payments", {
	id: text("id").primaryKey(),
	invoiceId: text("invoice_id")
		.notNull()
		.references(() => invoices.id),
	amount: numeric("amount").notNull(),
	paymentMode: text("payment_mode"),
	reference: text("reference"),
	paidAt: timestamp("paid_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                               RELATIONS                                    */
/* -------------------------------------------------------------------------- */

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	quotations: many(quotations),
	invoices: many(invoices),
}));

export const clientRelations = relations(clients, ({ many }) => ({
	quotations: many(quotations),
	invoices: many(invoices),
}));

export const quotationRelations = relations(quotations, ({ many, one }) => ({
	items: many(quotationItems),
	client: one(clients, {
		fields: [quotations.clientId],
		references: [clients.id],
	}),
}));

export const invoiceRelations = relations(invoices, ({ many, one }) => ({
	items: many(invoiceItems),
	client: one(clients, {
		fields: [invoices.clientId],
		references: [clients.id],
	}),
	payments: many(payments),
}));
