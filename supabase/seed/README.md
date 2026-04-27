# Database Seed

Simple seed script to populate Supabase with dummy data for development.

## Prerequisites

Database tables must be created first. Run migrations in Supabase SQL Editor:

1. Open https://app.supabase.com
2. Go to SQL Editor → New query
3. Copy contents from `supabase/migrations/_all_migrations.sql`
4. Paste and click Run

## Commands

```bash
# Show migration setup instructions
npm run migrate

# Seed database with dummy data
npm run seed
```

## What Gets Created

**Users (4)**

- alice@frontline.demo (Admin)
- bob@frontline.demo (User)
- carol@frontline.demo (User)
- david@frontline.demo (User)

All with password: `DemoPass123!`

**Analytics Data** (2,880+ records)

- 90 days of data
- 8 departments
- 4 regions
- 8 metrics per combination

**Reports** (6 per user)

- Quarterly Workforce Trends
- FMLA & Overtime Patterns
- Peer Benchmarking
- Departmental Performance
- Turnover Risk Assessment
- Hiring Velocity

**Alerts** (4 pre-configured)

- High turnover alerts
- Overtime warnings
- Productivity issues
- Staffing gaps

## Notes

- Seed is idempotent - safe to run multiple times
- Automatically cleans up old demo users on each run
- All data is realistic and historical
