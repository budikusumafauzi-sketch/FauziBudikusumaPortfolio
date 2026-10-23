-- =============================================================================
-- Least-Privilege Runtime Role Setup: portfolio_runtime
-- Reference: SCHEMA.md §8 & ARCHITECTURE.md §9
-- =============================================================================

-- 1. Create or update role with LOGIN and password
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'portfolio_runtime') THEN
    CREATE ROLE portfolio_runtime LOGIN PASSWORD 'CHANGE_ME_IN_ENV';
  ELSE
    ALTER ROLE portfolio_runtime WITH PASSWORD 'CHANGE_ME_IN_ENV';
  END IF;
END
$$;

-- 2. Grant CONNECT on database and USAGE on schema public
GRANT CONNECT ON DATABASE neondb TO portfolio_runtime;
GRANT USAGE ON SCHEMA public TO portfolio_runtime;

-- 3. Restrict privileges on tables: SELECT on KnowledgeRecord ONLY
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM portfolio_runtime;
GRANT SELECT ON TABLE "KnowledgeRecord" TO portfolio_runtime;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE "KnowledgeRecord" FROM portfolio_runtime;

-- 4. Defense-in-depth: statement timeout and default read-only session
ALTER ROLE portfolio_runtime SET statement_timeout = '3s';
ALTER ROLE portfolio_runtime SET default_transaction_read_only = on;
