/**
 * seed-founder-users.js
 *
 * Creates 20 users, 20 agencies, and 20 Founder plan subscriptions
 * to test the Founder plan cap (20-agency limit) functionality.
 *
 * Usage:
 *   node scripts/seed-founder-users.js
 *
 * To clean up after testing:
 *   node scripts/seed-founder-users.js --cleanup
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// ─────────────────────────────────────────────
// ✅ FIXED: Correct .env loading (ROOT SAFE)
// ─────────────────────────────────────────────

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('📁 Loading env from:', envPath);

// Check if MONGO_URL exists
if (!process.env.MONGO_URL) {
  console.error('❌ MONGO_URL not found in .env file');
  console.error('👉 Ensure .env exists in project root');
  process.exit(1);
}

console.log('📡 Attempting to connect to MongoDB...');

// ── Inline schema definitions ───────────────────────

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    agencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'agencies' }],
    role: { type: String, default: 'user' },
    plan: { type: String, required: true },
    isConfirmed: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
  },
  { timestamps: true, collection: 'users' }
);

const AgencySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    sizeCategory: { type: String, required: true },
    primaryServiceJurisdiction: { type: String, required: true },
    coverageArea: { type: Number, required: true },
  },
  { timestamps: true, collection: 'agencies' }
);

AgencySchema.index({ userId: 1, name: 1 }, { unique: true });

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    stripeCustomerId: { type: String, required: true },
    plan: { type: String, default: 'founder' },
    billingInterval: { type: String, default: 'monthly' },
    status: { type: String, default: 'active' },
    isFoundingRate: { type: Boolean, default: true },
    foundingRateLockedPrice: { type: Number, default: 149 },
    billingPausedUntil: { type: Date },
    foundingRateCommitmentEndDate: { type: Date },
    pricingLocked: { type: Boolean, default: true },
    lockedPrice: { type: Number, default: 149 },
    lockedAt: { type: Date },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
  },
  { timestamps: true, collection: 'subscriptions' }
);

const User = mongoose.model('User', UserSchema);
const Agency = mongoose.model('Agency', AgencySchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

// ── Config ───────────────────────────────────────────

const SEED_COUNT = 20;
const SEED_TAG = 'SEED_FOUNDER_TEST';
const PASSWORD = 'Test@1234';

const AGENCY_TYPES = ['Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined'];
const AGENCY_SIZES = ['Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)'];
const JURISDICTIONS = [
  'Downtown District','North County','South Valley','East Borough','West Township',
  'Central Metro','Riverside Zone','Highland Region','Coastal Area','Mountain District',
  'Harbor Division','Lakeside Sector','Prairie Zone','Forest County','Desert Region',
  'Bay Area','Canyon District','Summit Region','Peninsula Zone','Island Township',
];

// ── Helpers ──────────────────────────────────────────

const generateUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(PASSWORD, salt);

  return Array.from({ length: SEED_COUNT }, (_, i) => ({
    email: `founder.test.${i + 1}@seedtest.dev`,
    fullName: `Founder User ${i + 1} [${SEED_TAG}]`,
    password: passwordHash,
    plan: 'founder',
    isConfirmed: true,
    status: 'active',
    role: 'user',
  }));
};

const generateAgency = (userId, index) => ({
  userId,
  name: `${SEED_TAG} Agency ${index + 1}`,
  type: AGENCY_TYPES[index % AGENCY_TYPES.length],
  sizeCategory: AGENCY_SIZES[index % AGENCY_SIZES.length],
  primaryServiceJurisdiction: JURISDICTIONS[index],
  coverageArea: 50 + index * 10,
});

const generateSubscription = (userId, index) => {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  return {
    userId,
    stripeCustomerId: `cus_seed_founder_${index + 1}`,
    plan: 'founder',
    billingInterval: 'monthly',
    status: 'active',
    isFoundingRate: true,
    foundingRateLockedPrice: 149,
    lockedPrice: 149,
    lockedAt: now,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
  };
};

// ─────────────────────────────────────────────
// Mongo connection (UNCHANGED LOGIC)
// ─────────────────────────────────────────────

const connectMongo = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });

    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

// ── Seed ─────────────────────────────────────────────

const seed = async () => {
  console.log('\n🌱 Seeding Founder test data...\n');

  const users = await generateUsers();

  for (let i = 0; i < SEED_COUNT; i++) {
    let user = await User.findOne({ email: users[i].email });

    if (!user) user = await User.create(users[i]);

    const agencyName = `${SEED_TAG} Agency ${i + 1}`;
    let agency = await Agency.findOne({ userId: user._id, name: agencyName });

    if (!agency) {
      agency = await Agency.create(generateAgency(user._id, i));
      await User.findByIdAndUpdate(user._id, { $addToSet: { agencies: agency._id } });
    }

    let sub = await Subscription.findOne({ userId: user._id });
    if (!sub) sub = await Subscription.create(generateSubscription(user._id, i));

    console.log(`✅ ${i + 1}/20 ${user.email}`);
  }

  console.log('\n🎉 Seed completed\n');
};

// ── Cleanup ──────────────────────────────────────────

const cleanup = async () => {
  const users = await User.find({ fullName: { $regex: SEED_TAG } });
  const ids = users.map(u => u._id);

  await User.deleteMany({ _id: { $in: ids } });
  await Agency.deleteMany({ userId: { $in: ids } });
  await Subscription.deleteMany({ userId: { $in: ids } });

  console.log('🧹 Cleanup done');
};

// ── Main ─────────────────────────────────────────────

const isCleanup = process.argv.includes('--cleanup');

connectMongo()
  .then(() => (isCleanup ? cleanup() : seed()))
  .then(async () => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Error:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });