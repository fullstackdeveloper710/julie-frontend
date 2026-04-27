import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteExistingDemoUsers() {
  try {
    const { data: authUsers } = await supabase.auth.admin.listUsers();

    if (authUsers) {
      for (const user of authUsers.users) {
        if (user.email?.endsWith("@frontline.demo")) {
          await supabase.auth.admin.deleteUser(user.id);
          console.log(`✓ Deleted user: ${user.email}`);
        }
      }
    }
  } catch (error) {
    // Silent
  }
}

// Dummy user data
const dummyUsers = [
  {
    email: "alice@frontline.demo",
    password: "DemoPass123!",
    role: "admin",
  },
  {
    email: "bob@frontline.demo",
    password: "DemoPass123!",
    role: "user",
  },
  {
    email: "carol@frontline.demo",
    password: "DemoPass123!",
    role: "user",
  },
  {
    email: "david@frontline.demo",
    password: "DemoPass123!",
    role: "user",
  },
];

// Comprehensive departments
const departments = [
  "Engineering",
  "Product",
  "Sales",
  "Marketing",
  "People Ops",
  "Finance",
  "Operations",
  "Legal",
];

// Workforce metrics categories
const metricsCategories = [
  "headcount",
  "new_hires",
  "turnover",
  "fmla_hours",
  "overtime_hours",
  "productivity_score",
  "open_positions",
  "avg_tenure",
];

// Regions
const regions = ["North", "South", "East", "West"];

// Dummy subscription data
const dummySubscriptions = [
  { plan: "pro", status: "active" },
  { plan: "basic", status: "active" },
  { plan: "enterprise", status: "active" },
  { plan: "pro", status: "trialing" },
];

// Generate realistic workforce analytics data (90 days)
const generateAnalyticsData = (userId: string) => {
  const data = [];
  const baseDate = new Date();

  // Generate 90 days of data
  for (let i = 89; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Generate data for each department and region combination
    for (const department of departments) {
      for (const region of regions) {
        // Headcount (40-150 per department/region)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "headcount",
          region: region,
          value: Math.floor(Math.random() * 110) + 40,
          metadata: { department },
        });

        // New hires (0-10 per week)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "new_hires",
          region: region,
          value: Math.floor(Math.random() * 10),
          metadata: { department },
        });

        // Turnover rate (0-8%)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "turnover",
          region: region,
          value: Math.floor(Math.random() * 8),
          metadata: { department },
        });

        // FMLA hours (0-200 per week)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "fmla_hours",
          region: region,
          value: Math.floor(Math.random() * 200),
          metadata: { department },
        });

        // Overtime hours (0-500 per week)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "overtime_hours",
          region: region,
          value: Math.floor(Math.random() * 500),
          metadata: { department },
        });

        // Productivity score (60-100)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "productivity_score",
          region: region,
          value: Math.floor(Math.random() * 40) + 60,
          metadata: { department },
        });

        // Open positions (0-15)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "open_positions",
          region: region,
          value: Math.floor(Math.random() * 15),
          metadata: { department },
        });

        // Average tenure in months (3-120)
        data.push({
          user_id: userId,
          date: dateStr,
          category: "avg_tenure",
          region: region,
          value: Math.floor(Math.random() * 117) + 3,
          metadata: { department },
        });
      }
    }
  }

  return data;
};

// Generate comprehensive workforce reports
const generateReports = (userId: string) => [
  {
    user_id: userId,
    title: "Quarterly Workforce Trends Report",
    content:
      "Comprehensive analysis of workforce trends including headcount changes, hiring velocity, turnover rates, and departmental performance across Q1 2026. Key insights show Engineering at 92% productivity with 8 open positions, while Sales exceeded hiring targets by 15%. Recommendations include targeted retention programs for high-turnover departments.",
    type: "analytics",
    metadata: {
      quarter: "Q1",
      year: 2026,
      key_metrics: ["headcount", "turnover", "new_hires"],
      departments: departments,
    },
  },
  {
    user_id: userId,
    title: "FMLA & Overtime Pattern Analysis",
    content:
      "Detailed analysis of FMLA usage and overtime patterns across all departments and regions. North region shows 23% higher FMLA usage; Operations department averaging 450 overtime hours/week. Data-driven recommendations for workload redistribution and resource planning to reduce burnout and improve work-life balance.",
    type: "scenario",
    metadata: {
      focus: "fmla_ot",
      regions: regions,
      alert_threshold: true,
      high_risk_areas: ["Operations", "Finance"],
    },
  },
  {
    user_id: userId,
    title: "Peer Benchmarking Analysis - Industry Leaders",
    content:
      "Comparison of workforce metrics against industry peers. Your company's headcount growth (8%) exceeds industry average (5%). Turnover rate (6.2%) is 0.8% below industry benchmark. Productivity scores rank in top quartile. Recommendations: leverage competitive advantage in retention to attract top talent.",
    type: "custom",
    metadata: {
      industry: "general",
      size: "enterprise",
      benchmark_score: 87,
      ranking: "Top Quartile",
    },
  },
  {
    user_id: userId,
    title: "Departmental Performance Dashboard Export",
    content:
      "Executive summary of departmental performance metrics for last 30 days. Engineering leads with 94/100 productivity score; Sales closing 120% of quota; People Ops successfully filled 42/50 open positions. Charts and visualizations included in attached dashboard export.",
    type: "analytics",
    metadata: {
      period: "30_days",
      departments: departments.slice(0, 4),
      has_charts: true,
      key_metrics: ["productivity_score", "open_positions", "new_hires"],
    },
  },
  {
    user_id: userId,
    title: "Turnover Risk Assessment & Retention Strategy",
    content:
      "Identifies high-risk turnover areas and proposes retention strategies. Operations department at 8.2% turnover rate (3.2% above target). Root cause analysis indicates workload imbalance. Recommends cross-training program, flexible scheduling, and career development pathways. Expected impact: reduce turnover to 5% within 90 days.",
    type: "scenario",
    metadata: {
      focus: "turnover_risk",
      at_risk_departments: ["Operations", "Finance"],
      urgency: "high",
      projected_savings: "$850000 annually",
    },
  },
  {
    user_id: userId,
    title: "Hiring Velocity & Capacity Planning",
    content:
      "Analysis of hiring velocity trends and projections for next quarter. Current fill rate: 84% of open positions. Engineering and Product leading in hire quality metrics. Predictive model suggests peak hiring capacity in Q2 with 156 new hires possible across all departments. Resource recommendations provided.",
    type: "analytics",
    metadata: {
      period: "quarterly_forecast",
      projected_hires: 156,
      fill_rate: 0.84,
      departments_impacted: departments,
    },
  },
];

// Generate alerts based on data thresholds
const generateAlerts = (userId: string) => [
  {
    user_id: userId,
    type: "high_turnover",
    severity: "critical",
    department: "Operations",
    region: "East",
    message:
      "Operations department in East region experienced 8.5% turnover in last 30 days - 35% above target",
    created_at: new Date().toISOString(),
    resolved: false,
  },
  {
    user_id: userId,
    type: "overtime_alert",
    severity: "warning",
    department: "Finance",
    region: "North",
    message:
      "Finance department averaging 520 overtime hours/week - may impact employee wellness",
    created_at: new Date().toISOString(),
    resolved: false,
  },
  {
    user_id: userId,
    type: "low_productivity",
    severity: "info",
    department: "Marketing",
    region: "South",
    message:
      "Marketing South productivity score dropped to 62/100 - recommend workload review",
    created_at: new Date().toISOString(),
    resolved: false,
  },
  {
    user_id: userId,
    type: "staffing_gap",
    severity: "warning",
    department: "Engineering",
    region: "West",
    message:
      "Engineering West has 9 open critical positions - may impact product roadmap",
    created_at: new Date().toISOString(),
    resolved: false,
  },
];

async function seed() {
  try {
    console.log("🌱 Starting seed...\n");

    // Delete old demo users
    await deleteExistingDemoUsers();

    console.log("\n👥 Creating new users and data...\n");

    // Create auth users and get their IDs
    const userIds: string[] = [];

    for (const user of dummyUsers) {
      try {
        // Create auth user
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
          });

        if (authError) {
          console.log(`⚠️ Auth user ${user.email} might already exist:`, authError.message);
          // Try to get existing user
          const { data: users, error: searchError } =
            await supabase.auth.admin.listUsers();
          if (!searchError && users) {
            const existingUser = users.users.find(
              (u) => u.email === user.email
            );
            if (existingUser) {
              userIds.push(existingUser.id);
              console.log(`✓ Using existing user: ${user.email}`);
            }
          }
        } else if (authData?.user) {
          console.log(`✓ Created auth user: ${user.email}`);
          userIds.push(authData.user.id);

          // Create DB user profile
          const { error: dbError } = await supabase
            .from("users")
            .insert([
              {
                id: authData.user.id,
                email: user.email,
                role: user.role,
              },
            ]);

          if (dbError) {
            console.log(`⚠️ DB user profile might already exist:`, dbError.message);
          } else {
            console.log(`✓ Created user profile`);
          }
        }
      } catch (err) {
        console.error(`Error creating user ${user.email}:`, err);
      }
    }

    console.log(`\n✓ Created ${userIds.length} users\n`);

    // Create subscriptions
    let subscriptionCount = 0;
    for (let i = 0; i < userIds.length; i++) {
      const subData = dummySubscriptions[i];
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { error } = await supabase.from("subscriptions").insert([
        {
          user_id: userIds[i],
          stripe_customer_id: `cus_demo_${i}`,
          stripe_subscription_id: `sub_demo_${i}`,
          plan: subData.plan,
          status: subData.status,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        },
      ]);

      if (error) {
        console.log(
          `⚠️ Subscription for user ${i + 1} might already exist:`,
          error.message
        );
      } else {
        subscriptionCount++;
        console.log(`✓ Created ${subData.plan} subscription for user ${i + 1}`);
      }
    }

    console.log(`\n✓ Created ${subscriptionCount} subscriptions\n`);

    // Create analytics data
    let analyticsCount = 0;
    for (const userId of userIds) {
      const analyticsData = generateAnalyticsData(userId);
      const { error } = await supabase
        .from("analytics_data")
        .insert(analyticsData);

      if (error) {
        console.log(
          `⚠️ Analytics data for user ${userId} might already exist:`,
          error.message
        );
      } else {
        analyticsCount += analyticsData.length;
        console.log(`✓ Created ${analyticsData.length} analytics records`);
      }
    }

    console.log(`\n✓ Created ${analyticsCount} analytics records\n`);

    // Create reports
    let reportCount = 0;
    for (const userId of userIds) {
      const reports = generateReports(userId);
      const { error } = await supabase.from("reports").insert(reports);

      if (error) {
        console.log(
          `⚠️ Reports for user ${userId} might already exist:`,
          error.message
        );
      } else {
        reportCount += reports.length;
        console.log(`✓ Created ${reports.length} reports`);
      }
    }

    console.log(`\n✓ Created ${reportCount} reports\n`);

    // Create alerts (note: alerts table may not exist yet)
    let alertCount = 0;
    for (const userId of userIds) {
      const alerts = generateAlerts(userId);
      const { error } = await supabase.from("alerts").insert(alerts);

      if (error) {
        if (
          error.message.includes("does not exist") ||
          error.message.includes("Table not found")
        ) {
          console.log(
            `ℹ️ Alerts table not found - create with migration to enable alerts`
          );
        } else {
          console.log(
            `⚠️ Alerts for user ${userId} might already exist:`,
            error.message
          );
        }
      } else {
        alertCount += alerts.length;
        console.log(`✓ Created ${alerts.length} alerts`);
      }
    }

    if (alertCount > 0) {
      console.log(`\n✓ Created ${alertCount} alerts\n`);
    }

    console.log("🎉 Seed completed successfully!\n");
    console.log("Demo credentials:");
    dummyUsers.forEach((user) => {
      console.log(`  - ${user.email} / ${user.password}`);
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
