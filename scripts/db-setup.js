const fs = require('fs');
const path = require('path');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Error: DATABASE_URL is not set.");
  process.exit(1);
}

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword) {
  console.error("Error: ADMIN_PASSWORD is not set.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { ssl: 'require' });

async function setup() {
  try {
    console.log("Connecting to PostgreSQL database...");

    // 1. Load and execute baseline schema.sql
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log("Loading baseline schema.sql...");
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Execute the entire schema.sql inside a transaction
      console.log("Applying baseline database schema...");
      await sql.begin(async (sqlTx) => {
        // split by double-dash comments or just run raw if the driver supports multiple statements.
        // postgres.js supports sending multiple statements separated by semicolons in raw queries.
        await sqlTx.unsafe(schemaSql);
      });
      console.log("Baseline database schema applied successfully.");
    } else {
      console.warn("Warning: supabase/schema.sql not found. Skipping baseline schema.");
    }

    // 2. Create admins table
    console.log("Creating public.admins table if it doesn't exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS public.admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;

    // 3. Create audit_logs table
    console.log("Creating public.audit_logs table if it doesn't exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      )
    `;

    // 4. Enable RLS on both tables
    console.log("Enabling RLS on admin tables...");
    await sql`ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY`;
    await sql`ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY`;

    // 5. Drop existing policies to prevent conflicts, then recreate them as private (false)
    console.log("Recreating RLS policies...");
    try {
      await sql`DROP POLICY IF EXISTS "Admins are private" ON public.admins`;
    } catch (e) {}
    try {
      await sql`DROP POLICY IF EXISTS "Audit logs are private" ON public.audit_logs`;
    } catch (e) {}

    await sql`CREATE POLICY "Admins are private" ON public.admins FOR ALL USING (false)`;
    await sql`CREATE POLICY "Audit logs are private" ON public.audit_logs FOR ALL USING (false)`;

    // 6. Bootstrap admin if none exists
    const existingAdmins = await sql`SELECT id FROM public.admins LIMIT 1`;
    if (existingAdmins.length === 0) {
      console.log(`No administrators found. Bootstrapping admin '${adminUsername}'...`);
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(adminPassword, salt);
      
      await sql`
        INSERT INTO public.admins (username, password_hash)
        VALUES (${adminUsername}, ${hash})
      `;
      console.log(`Admin account '${adminUsername}' successfully bootstrapped in database.`);
    } else {
      console.log("Admin accounts already exist. Skipping bootstrap.");
    }

    // 7. Alter pages table to add custom captions columns if they don't exist
    console.log("Adding caption columns to public.pages...");
    await sql`ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS heading TEXT`;
    await sql`ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS subheading TEXT`;
    await sql`ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS quote TEXT`;
    await sql`ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS button_text TEXT`;
    await sql`ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS footer_text TEXT`;

    // 8. Alter projects table to add status and mascot config columns if they don't exist
    console.log("Adding status and mascot columns to public.projects...");
    await sql`ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft'`;
    await sql`ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS occasion VARCHAR(50) DEFAULT 'birthday'`;
    await sql`ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS mascot_config JSONB DEFAULT '{}'::jsonb`;

    console.log("Database schema setup completed successfully!");
  } catch (error) {
    console.error("Database setup failed:", error);
  } finally {
    await sql.end();
  }
}

setup();
