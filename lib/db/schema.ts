import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  varchar,
  decimal,
  integer,
  index,
  uniqueIndex,
  foreignKey,
} from 'drizzle-orm/pg-core'

// Better Auth Tables (do not modify)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified'),
  image: text('image'),
  createdAt: timestamp('createdAt').default(new Date()),
  updatedAt: timestamp('updatedAt'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').default(new Date()),
  updatedAt: timestamp('updatedAt'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').default(new Date()),
  updatedAt: timestamp('updatedAt'),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').default(new Date()),
  updatedAt: timestamp('updatedAt'),
})

// App Tables
export const services = pgTable(
  'services',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description').notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    features: text('features').array(),
    deliveryTime: varchar('delivery_time', { length: 100 }),
    revisions: integer('revisions').default(2),
    active: boolean('active').default(true),
    userId: text('userId').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_services_user_id').on(table.userId),
  ]
)

export const portfolio = pgTable(
  'portfolio',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }).notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    link: varchar('link', { length: 500 }),
    userId: text('userId').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_portfolio_user_id').on(table.userId),
  ]
)

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    authorName: varchar('author_name', { length: 255 }).notNull(),
    authorEmail: varchar('author_email', { length: 255 }),
    rating: integer('rating'),
    comment: text('comment').notNull(),
    serviceId: integer('service_id'),
    verified: boolean('verified').default(false),
    userId: text('userId').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('idx_reviews_user_id').on(table.userId),
  ]
)

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
    serviceId: integer('service_id').notNull(),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerPhone: varchar('customer_phone', { length: 20 }),
    description: text('description'),
    status: varchar('status', { length: 50 }).default('pending'),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }),
    referenceCode: varchar('reference_code', { length: 100 }),
    notes: text('notes'),
    userId: text('userId').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_orders_user_id').on(table.userId),
    index('idx_orders_status').on(table.status),
  ]
)

export const contacts = pgTable(
  'contacts',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    status: varchar('status', { length: 50 }).default('new'),
    response: text('response'),
    userId: text('userId').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_contacts_user_id').on(table.userId),
    index('idx_contacts_status').on(table.status),
  ]
)

export const affiliates = pgTable(
  'affiliates',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    website: varchar('website', { length: 500 }),
    commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('10.00'),
    bankDetails: text('bank_details'),
    status: varchar('status', { length: 50 }).default('pending'),
    referralCode: varchar('referral_code', { length: 50 }).notNull().unique(),
    totalReferrals: integer('total_referrals').default(0),
    totalCommission: decimal('total_commission', { precision: 10, scale: 2 }).default('0.00'),
    userId: text('userId'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_affiliates_status').on(table.status),
  ]
)

export const referrals = pgTable(
  'referrals',
  {
    id: serial('id').primaryKey(),
    affiliateId: integer('affiliate_id').notNull(),
    orderId: integer('order_id').notNull(),
    commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_referrals_affiliate_id').on(table.affiliateId),
  ]
)

export const affiliateWithdrawals = pgTable(
  'affiliate_withdrawals',
  {
    id: serial('id').primaryKey(),
    affiliateId: integer('affiliate_id').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    status: varchar('status', { length: 50 }).default('pending'),
    bankDetails: text('bank_details'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
)
