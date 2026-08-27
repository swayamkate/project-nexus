--
-- PostgreSQL database dump
--

\restrict 9xL4uWwqiG3dLwCy83rbF4NsXubu58IWAqaoxRBL0Azn1cxSYyg9Qd320uIyogH

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA _realtime;


ALTER SCHEMA _realtime OWNER TO supabase_admin;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA supabase_functions;


ALTER SCHEMA supabase_functions OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: business_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.business_status_type AS ENUM (
    'active',
    'scaling',
    'struggling',
    'closed',
    'transitioning'
);


ALTER TYPE public.business_status_type OWNER TO postgres;

--
-- Name: employment_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employment_status_type AS ENUM (
    'employed',
    'self_employed',
    'apprenticeship',
    'job_seeking',
    'not_employed'
);


ALTER TYPE public.employment_status_type OWNER TO postgres;

--
-- Name: followup_milestone_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.followup_milestone_type AS ENUM (
    '3_months',
    '6_months',
    '12_months',
    '18_months',
    '24_months'
);


ALTER TYPE public.followup_milestone_type OWNER TO postgres;

--
-- Name: followup_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.followup_status_type AS ENUM (
    'scheduled',
    'completed',
    'upcoming',
    'overdue',
    'pending'
);


ALTER TYPE public.followup_status_type OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'superadmin',
    'admin',
    'evaluator',
    'employer',
    'trainee'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: get_trainee_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_trainee_id() RETURNS uuid
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN (SELECT id FROM public.trainees WHERE user_id = auth.uid() LIMIT 1);
END;
$$;


ALTER FUNCTION public.get_trainee_id() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth', 'pg_temp'
    AS $$
DECLARE
    clean_username VARCHAR(100);
    derived_name VARCHAR(255);
BEGIN
    -- Extract username from raw_user_meta_data or from email prefix
    clean_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Extract full name
    derived_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        INITCAP(REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', ' '))
    );

    -- Insert into public.trainees
    INSERT INTO public.trainees (
        user_id,
        email,
        username,
        full_name,
        is_active
    ) VALUES (
        NEW.id,
        NEW.email,
        clean_username,
        derived_name,
        true
    ) ON CONFLICT (email) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        username = COALESCE(public.trainees.username, EXCLUDED.username);

    -- Insert role into user_roles
    INSERT INTO public.user_roles (
        user_id,
        email,
        username,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        clean_username,
        CASE 
            WHEN NEW.email = 'admin@nexus.com' THEN 'superadmin'::public.user_role
            ELSE 'trainee'::public.user_role
        END
    ) ON CONFLICT DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin', 'evaluator')
  );
END;
$$;


ALTER FUNCTION public.is_admin() OWNER TO postgres;

--
-- Name: is_superadmin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_superadmin() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'superadmin'
  );
END;
$$;


ALTER FUNCTION public.is_superadmin() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload bytea, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(c.column_name order by c.ordinal_position),
            '{}'::text[]
        )
        from
            information_schema.columns c
        where
            format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                format('%I.%I', c.table_schema, c.table_name)::regclass,
                c.column_name,
                'SELECT'
            );
    table_col_names text[] = coalesce(
            array_agg(pa.attname),
            '{}'::text[]
        )
        from
            pg_attribute pa
        where
            pa.attrelid = new.entity
            and pa.attnum > 0;
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        -- Filtered column is valid
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        -- Type is sanitized and safe for string interpolation
        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;
        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        else
            -- raises an exception if value is not coercable to type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    -- Validate that selected_columns reference columns the role can SELECT
    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint on
    -- (subscription_id, entity, filters) can't be tricked by a different filter order
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value),
        '{}'
    ) from unnest(new.filters) f;

    -- Normalize selected_columns order so ARRAY['a','b'] and ARRAY['b','a'] are
    -- treated as the same subscription group in apply_rls
    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
    DECLARE
      request_id bigint;
      payload jsonb;
      url text := TG_ARGV[0]::text;
      method text := TG_ARGV[1]::text;
      headers jsonb DEFAULT '{}'::jsonb;
      params jsonb DEFAULT '{}'::jsonb;
      timeout_ms integer DEFAULT 1000;
    BEGIN
      IF url IS NULL OR url = 'null' THEN
        RAISE EXCEPTION 'url argument is missing';
      END IF;

      IF method IS NULL OR method = 'null' THEN
        RAISE EXCEPTION 'method argument is missing';
      END IF;

      IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
        headers = '{"Content-Type": "application/json"}'::jsonb;
      ELSE
        headers = TG_ARGV[2]::jsonb;
      END IF;

      IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
        params = '{}'::jsonb;
      ELSE
        params = TG_ARGV[3]::jsonb;
      END IF;

      IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
        timeout_ms = 1000;
      ELSE
        timeout_ms = TG_ARGV[4]::integer;
      END IF;

      CASE
        WHEN method = 'GET' THEN
          SELECT http_get INTO request_id FROM net.http_get(
            url,
            params,
            headers,
            timeout_ms
          );
        WHEN method = 'POST' THEN
          payload = jsonb_build_object(
            'old_record', OLD,
            'record', NEW,
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
          );

          SELECT http_post INTO request_id FROM net.http_post(
            url,
            payload,
            params,
            headers,
            timeout_ms
          );
        ELSE
          RAISE EXCEPTION 'method argument % is invalid', method;
      END CASE;

      INSERT INTO supabase_functions.hooks
        (hook_table_id, hook_name, request_id)
      VALUES
        (TG_RELID, TG_NAME, request_id);

      RETURN NEW;
    END
  $$;


ALTER FUNCTION supabase_functions.http_request() OWNER TO supabase_functions_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE _realtime.extensions OWNER TO supabase_admin;

--
-- Name: feature_flags; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.feature_flags (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE _realtime.feature_flags OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE _realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL,
    migrations_ran integer DEFAULT 0,
    broadcast_adapter character varying(255) DEFAULT 'gen_rpc'::character varying,
    max_presence_events_per_second integer DEFAULT 1000,
    max_payload_size_in_kb integer DEFAULT 3000,
    max_client_presence_events_per_window integer,
    client_presence_window_ms integer,
    presence_enabled boolean DEFAULT false NOT NULL,
    feature_flags jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT jwt_secret_or_jwt_jwks_required CHECK (((jwt_secret IS NOT NULL) OR (jwt_jwks IS NOT NULL)))
);


ALTER TABLE _realtime.tenants OWNER TO supabase_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: ai_policy_insights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_policy_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    insight_text text NOT NULL,
    target_sector character varying(100),
    target_districts text[],
    confidence_score numeric(5,2) DEFAULT 94.5,
    recommended_action text,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.ai_policy_insights OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_email character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    target_entity character varying(100),
    target_id character varying(100),
    details text,
    ip_address character varying(50),
    status character varying(50) DEFAULT 'Success'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: district_employment_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.district_employment_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    district_name character varying(100) NOT NULL,
    total_trained integer DEFAULT 0 NOT NULL,
    employed_count integer DEFAULT 0 NOT NULL,
    self_employed_count integer DEFAULT 0 NOT NULL,
    seeking_count integer DEFAULT 0 NOT NULL,
    avg_wage numeric(10,2) DEFAULT 0,
    placement_rate numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.district_employment_stats OWNER TO postgres;

--
-- Name: employers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name character varying(255) NOT NULL,
    industry character varying(100) DEFAULT 'Manufacturing'::character varying NOT NULL,
    contact_email character varying(255) NOT NULL,
    contact_phone character varying(50) DEFAULT ''::character varying,
    district character varying(100) DEFAULT 'Pune'::character varying,
    state character varying(100) DEFAULT 'Maharashtra'::character varying,
    is_verified boolean DEFAULT true NOT NULL,
    website character varying(255) DEFAULT ''::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.employers OWNER TO postgres;

--
-- Name: enterprise_ledger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enterprise_ledger (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    entry_month character varying(20) NOT NULL,
    revenue_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    expense_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    net_profit numeric(12,2) DEFAULT 0.00 NOT NULL,
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enterprise_ledger OWNER TO postgres;

--
-- Name: government_schemes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.government_schemes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    nodal_agency character varying(255) NOT NULL,
    subsidy_pct numeric(5,2) DEFAULT 35.00 NOT NULL,
    max_grant_amount numeric(14,2) DEFAULT 500000.00 NOT NULL,
    target_trades text[] DEFAULT ARRAY['Tailoring'::text, 'Solar'::text, 'EV Repair'::text],
    allocated_budget numeric(16,2) DEFAULT 50000000.00 NOT NULL,
    disbursed_budget numeric(16,2) DEFAULT 14250000.00 NOT NULL,
    beneficiaries_count integer DEFAULT 142 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.government_schemes OWNER TO postgres;

--
-- Name: job_postings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_postings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employer_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    trade_category character varying(100) NOT NULL,
    min_salary numeric(10,2) DEFAULT 15000.00 NOT NULL,
    max_salary numeric(10,2) DEFAULT 25000.00 NOT NULL,
    location_district character varying(100) DEFAULT 'Pune'::character varying NOT NULL,
    openings_count integer DEFAULT 3 NOT NULL,
    type character varying(50) DEFAULT 'full_time'::character varying NOT NULL,
    status character varying(50) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT job_postings_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'filled'::character varying, 'closed'::character varying])::text[]))),
    CONSTRAINT job_postings_type_check CHECK (((type)::text = ANY ((ARRAY['full_time'::character varying, 'apprenticeship'::character varying, 'part_time'::character varying])::text[])))
);


ALTER TABLE public.job_postings OWNER TO postgres;

--
-- Name: platform_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    user_email character varying(255) NOT NULL,
    user_name character varying(255) DEFAULT 'Nexus User'::character varying,
    category character varying(100) DEFAULT 'bug'::character varying NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    rating integer DEFAULT 5,
    status character varying(50) DEFAULT 'open'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.platform_feedback OWNER TO postgres;

--
-- Name: privacy_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.privacy_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid,
    request_type character varying(50) DEFAULT 'portability'::character varying NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    details text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    processed_at timestamp with time zone,
    CONSTRAINT privacy_requests_request_type_check CHECK (((request_type)::text = ANY ((ARRAY['portability'::character varying, 'erasure'::character varying, 'rectification'::character varying, 'consent_withdrawal'::character varying])::text[]))),
    CONSTRAINT privacy_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.privacy_requests OWNER TO postgres;

--
-- Name: promo_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promo_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    discount_type character varying(50) DEFAULT 'percentage'::character varying NOT NULL,
    discount_val character varying(50) DEFAULT '100% OFF'::character varying NOT NULL,
    max_uses integer DEFAULT 500 NOT NULL,
    current_uses integer DEFAULT 0 NOT NULL,
    district character varying(100) DEFAULT 'All Districts'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promo_codes OWNER TO postgres;

--
-- Name: recommended_opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommended_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    provider character varying(255) NOT NULL,
    link_url text,
    description text,
    target_skills text[],
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recommended_opportunities OWNER TO postgres;

--
-- Name: scheme_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scheme_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_no character varying(50) DEFAULT ((('SCH-'::text || to_char(now(), 'YYYY'::text)) || '-'::text) || lpad((floor(((random() * (90000)::double precision) + (10000)::double precision)))::text, 5, '0'::text)) NOT NULL,
    trainee_id uuid NOT NULL,
    scheme_id uuid NOT NULL,
    business_name character varying(255) DEFAULT ''::character varying NOT NULL,
    requested_amount numeric(12,2) DEFAULT 50000.00 NOT NULL,
    sanctioned_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    status character varying(50) DEFAULT 'submitted'::character varying NOT NULL,
    bank_account_no character varying(50) DEFAULT ''::character varying,
    ifsc_code character varying(20) DEFAULT ''::character varying,
    remarks text DEFAULT ''::text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT scheme_applications_status_check CHECK (((status)::text = ANY ((ARRAY['submitted'::character varying, 'under_review'::character varying, 'sanctioned'::character varying, 'disbursed'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.scheme_applications OWNER TO postgres;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid,
    trainee_name character varying(255) DEFAULT ''::character varying,
    trainee_email character varying(255) NOT NULL,
    category character varying(100) DEFAULT 'Certificate Verification'::character varying NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'open'::character varying NOT NULL,
    assigned_to character varying(255) DEFAULT 'District Officer Pune'::character varying,
    admin_response text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- Name: survey_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.survey_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    milestone character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text DEFAULT ''::text,
    questions jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.survey_templates OWNER TO postgres;

--
-- Name: top_skill_gaps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.top_skill_gaps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    skill_name character varying(150) NOT NULL,
    demand_count integer DEFAULT 0 NOT NULL,
    supply_count integer DEFAULT 0 NOT NULL,
    gap_percentage numeric(5,2) DEFAULT 0 NOT NULL,
    priority_level character varying(20) DEFAULT 'High'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.top_skill_gaps OWNER TO postgres;

--
-- Name: trainee_employment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_employment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    status public.employment_status_type DEFAULT 'job_seeking'::public.employment_status_type NOT NULL,
    company_name character varying(255),
    designation character varying(150),
    joining_date date,
    monthly_salary numeric(12,2) DEFAULT 0,
    offer_letter_url text,
    business_name character varying(255),
    business_type character varying(150),
    business_category character varying(100),
    business_status public.business_status_type DEFAULT 'active'::public.business_status_type,
    establishment_date date,
    monthly_revenue numeric(12,2) DEFAULT 0,
    monthly_profit numeric(12,2) DEFAULT 0,
    udyam_number character varying(100),
    gst_number character varying(50),
    business_address text,
    employees_count integer DEFAULT 0,
    verified_by_admin boolean DEFAULT false NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trainee_employment OWNER TO postgres;

--
-- Name: trainee_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    program_id uuid NOT NULL,
    enrolled_date date DEFAULT CURRENT_DATE NOT NULL,
    completed_date date,
    certified_date date,
    certificate_id character varying(100) DEFAULT ('MS-CERT-'::text || lpad((floor(((random() * (900000)::double precision) + (100000)::double precision)))::text, 6, '0'::text)),
    status character varying(50) DEFAULT 'enrolled'::character varying NOT NULL,
    grade character varying(10) DEFAULT 'A'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trainee_enrollments OWNER TO postgres;

--
-- Name: trainee_followups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_followups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    milestone public.followup_milestone_type NOT NULL,
    due_date date NOT NULL,
    completed_date date,
    status public.followup_status_type DEFAULT 'upcoming'::public.followup_status_type NOT NULL,
    current_status public.employment_status_type,
    current_income_range character varying(50),
    income_growth_pct numeric(5,2) DEFAULT 0,
    job_satisfaction_score integer,
    skill_utilization_score integer,
    additional_support_needed text,
    survey_channel character varying(50) DEFAULT 'web_portal'::character varying,
    survey_data_json jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trainee_followups_job_satisfaction_score_check CHECK (((job_satisfaction_score >= 1) AND (job_satisfaction_score <= 5))),
    CONSTRAINT trainee_followups_skill_utilization_score_check CHECK (((skill_utilization_score >= 1) AND (skill_utilization_score <= 5)))
);


ALTER TABLE public.trainee_followups OWNER TO postgres;

--
-- Name: trainee_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trainee_notifications OWNER TO postgres;

--
-- Name: trainees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    trainee_id character varying(50) DEFAULT ('TRN-'::text || lpad((floor(((random() * (900000)::double precision) + (100000)::double precision)))::text, 6, '0'::text)) NOT NULL,
    username character varying(100),
    full_name character varying(255) DEFAULT ''::character varying NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) DEFAULT ''::character varying,
    dob date DEFAULT '2000-01-01'::date,
    gender character varying(30) DEFAULT 'Not Specified'::character varying,
    aadhaar_masked character varying(20) DEFAULT 'XXXX-XXXX-0000'::character varying,
    address text DEFAULT ''::text,
    district character varying(100) DEFAULT ''::character varying,
    state character varying(100) DEFAULT 'Maharashtra'::character varying,
    pincode character varying(20) DEFAULT ''::character varying,
    avatar_url text DEFAULT ''::text,
    profile_completion_pct integer DEFAULT 30 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    highest_education character varying(150) DEFAULT ''::character varying,
    board_university character varying(255) DEFAULT ''::character varying,
    year_of_passing integer DEFAULT 2022,
    education_percentage numeric(5,2) DEFAULT 0.00,
    skills text[] DEFAULT ARRAY[]::text[] NOT NULL,
    about_me text DEFAULT ''::text,
    privacy_hash character varying(64) DEFAULT encode(extensions.digest(extensions.gen_random_bytes(32), 'sha256'::text), 'hex'::text) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    notification_preferences jsonb DEFAULT '{"browser": true, "surveys": true, "telegram": false}'::jsonb,
    CONSTRAINT trainees_profile_completion_pct_check CHECK (((profile_completion_pct >= 0) AND (profile_completion_pct <= 100)))
);


ALTER TABLE public.trainees OWNER TO postgres;

--
-- Name: training_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training_programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    sector character varying(100) NOT NULL,
    duration_months integer DEFAULT 3 NOT NULL,
    provider_name character varying(255) DEFAULT 'Maharashtra State Skill Development Society (MSSDS)'::character varying NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_programs OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email character varying(255) NOT NULL,
    username character varying(100),
    role public.user_role DEFAULT 'trainee'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    document_type character varying(100) NOT NULL,
    document_name character varying(255) NOT NULL,
    document_url text NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    admin_notes text,
    reviewed_by character varying(255),
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verifications OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_08_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_08_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_24 OWNER TO supabase_admin;

--
-- Name: messages_2026_08_25; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_08_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_25 OWNER TO supabase_admin;

--
-- Name: messages_2026_08_26; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_08_26 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_26 OWNER TO supabase_admin;

--
-- Name: messages_2026_08_27; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_08_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_27 OWNER TO supabase_admin;

--
-- Name: messages_2026_08_28; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_08_28 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_28 OWNER TO supabase_admin;

--
-- Name: messages_2026_08_29; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_08_29 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_08_29 OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: iceberg_namespaces; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.iceberg_namespaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_name text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    catalog_id uuid NOT NULL
);


ALTER TABLE storage.iceberg_namespaces OWNER TO supabase_storage_admin;

--
-- Name: iceberg_tables; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.iceberg_tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    namespace_id uuid NOT NULL,
    bucket_name text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    location text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    remote_table_id text,
    shard_key text,
    shard_id text,
    catalog_id uuid NOT NULL
);


ALTER TABLE storage.iceberg_tables OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


ALTER TABLE supabase_functions.hooks OWNER TO supabase_functions_admin;

--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE supabase_functions.hooks_id_seq OWNER TO supabase_functions_admin;

--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supabase_functions.migrations OWNER TO supabase_functions_admin;

--
-- Name: messages_2026_08_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_24 FOR VALUES FROM ('2026-08-24 00:00:00') TO ('2026-08-25 00:00:00');


--
-- Name: messages_2026_08_25; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_25 FOR VALUES FROM ('2026-08-25 00:00:00') TO ('2026-08-26 00:00:00');


--
-- Name: messages_2026_08_26; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_26 FOR VALUES FROM ('2026-08-26 00:00:00') TO ('2026-08-27 00:00:00');


--
-- Name: messages_2026_08_27; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_27 FOR VALUES FROM ('2026-08-27 00:00:00') TO ('2026-08-28 00:00:00');


--
-- Name: messages_2026_08_28; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_28 FOR VALUES FROM ('2026-08-28 00:00:00') TO ('2026-08-29 00:00:00');


--
-- Name: messages_2026_08_29; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_08_29 FOR VALUES FROM ('2026-08-29 00:00:00') TO ('2026-08-30 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
fdf08487-fde7-4249-9427-892e8fa2e19b	postgres_cdc_rls	{"region": "us-east-1", "db_host": "QhixI0o7PYIABziLUL4f0A==", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "dmUibq4THo7vjdr5MEORsQ==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2026-08-26 18:52:48	2026-08-26 18:52:48
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.feature_flags (id, name, enabled, inserted_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2026-08-25 17:01:04
20220329161857	2026-08-25 17:01:04
20220410212326	2026-08-25 17:01:04
20220506102948	2026-08-25 17:01:04
20220527210857	2026-08-25 17:01:04
20220815211129	2026-08-25 17:01:04
20220815215024	2026-08-25 17:01:04
20220818141501	2026-08-25 17:01:04
20221018173709	2026-08-25 17:01:04
20221102172703	2026-08-25 17:01:04
20221223010058	2026-08-25 17:01:04
20230110180046	2026-08-25 17:01:04
20230810220907	2026-08-25 17:01:04
20230810220924	2026-08-25 17:01:04
20231024094642	2026-08-25 17:01:04
20240306114423	2026-08-25 17:01:04
20240418082835	2026-08-25 17:01:04
20240625211759	2026-08-25 17:01:04
20240704172020	2026-08-25 17:01:04
20240902173232	2026-08-25 17:01:04
20241106103258	2026-08-25 17:01:04
20250424203323	2026-08-25 17:01:04
20250613072131	2026-08-25 17:01:04
20250711044927	2026-08-25 17:01:04
20250811121559	2026-08-25 17:01:04
20250926223044	2026-08-25 17:01:04
20251204170944	2026-08-25 17:01:04
20251218000543	2026-08-25 17:01:04
20260209232800	2026-08-25 17:01:04
20260304000000	2026-08-25 17:01:04
20260422000000	2026-08-25 17:01:04
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only, migrations_ran, broadcast_adapter, max_presence_events_per_second, max_payload_size_in_kb, max_client_presence_events_per_window, client_presence_window_ms, presence_enabled, feature_flags) FROM stdin;
16f3c3cb-4bae-4cdd-a284-d1573a06745b	realtime-dev	realtime-dev	iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSme+hV8m/XZ/MlFWcoV6btmQv1+RoSIHPXXyNgYlnay6zQ=	200	2026-08-26 18:52:48	2026-08-26 18:52:48	100	postgres_cdc_rls	100000	100	100	f	\N	f	f	72	gen_rpc	1000	3000	\N	\N	f	{}
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	4b0e1a7b-78ab-43c3-ac3f-e056ea3e3541	{"action":"user_confirmation_requested","actor_id":"0c188244-1178-4d8e-98a5-a64e47c60902","actor_username":"test_verify_user@avishkark.in","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-08-26 15:43:16.820079+00	
00000000-0000-0000-0000-000000000000	3a368a69-2682-4dae-8bc8-08a1ca14705b	{"action":"user_confirmation_requested","actor_id":"13fefb00-4206-4063-b0d2-e89b830d8fa5","actor_username":"user_1787760096793@avishkark.in","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-08-26 16:01:37.989417+00	
00000000-0000-0000-0000-000000000000	a2275fa6-8e9d-438f-a19d-250de0f68851	{"action":"user_confirmation_requested","actor_id":"1ce93a23-73dc-401c-9fce-a29ccd85d76b","actor_username":"instant_user_1787760183293@avishkark.in","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-08-26 16:03:04.389473+00	
00000000-0000-0000-0000-000000000000	d62813ad-b061-4bc6-907f-77a4055f3ff1	{"action":"user_signedup","actor_id":"eea42e7e-ade9-4fda-8ae9-aa9e364f9453","actor_username":"instant_user_1787760299769@avishkark.in","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:05:00.894306+00	
00000000-0000-0000-0000-000000000000	12264357-f49e-4bf3-9966-81fa6e2f83f4	{"action":"login","actor_id":"eea42e7e-ade9-4fda-8ae9-aa9e364f9453","actor_username":"instant_user_1787760299769@avishkark.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:05:00.904704+00	
00000000-0000-0000-0000-000000000000	cad44ec6-d9cd-4b01-921b-e9e20989164a	{"action":"login","actor_id":"eea42e7e-ade9-4fda-8ae9-aa9e364f9453","actor_username":"instant_user_1787760299769@avishkark.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:05:01.339506+00	
00000000-0000-0000-0000-000000000000	71c17d41-b322-4abe-b439-139a0336a7ad	{"action":"user_signedup","actor_id":"9ace3578-5418-4a64-a9f4-41ecdb5fd2c4","actor_username":"realbrowser_1787760722388@avishkark.in","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:12:03.758859+00	
00000000-0000-0000-0000-000000000000	df70eabe-8b13-4deb-aa1e-6f9481df4ab0	{"action":"login","actor_id":"9ace3578-5418-4a64-a9f4-41ecdb5fd2c4","actor_username":"realbrowser_1787760722388@avishkark.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:12:03.769532+00	
00000000-0000-0000-0000-000000000000	5f4b4e3f-2803-4ea2-b9fd-7bb40ea2dc69	{"action":"user_signedup","actor_id":"dd4c0101-ec78-41fd-bb53-f81c53b3e3d2","actor_username":"testpilot_1787760958305@avishkark.in","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:15:59.8164+00	
00000000-0000-0000-0000-000000000000	5af5b27b-f7fb-4935-b675-0745e99e26f4	{"action":"login","actor_id":"dd4c0101-ec78-41fd-bb53-f81c53b3e3d2","actor_username":"testpilot_1787760958305@avishkark.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:15:59.827251+00	
00000000-0000-0000-0000-000000000000	e7542584-efe2-4a3c-aa01-3cb8dc5099d6	{"action":"login","actor_id":"dd4c0101-ec78-41fd-bb53-f81c53b3e3d2","actor_username":"testpilot_1787760958305@avishkark.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:16:04.217782+00	
00000000-0000-0000-0000-000000000000	251779da-ba5a-4b55-b8ad-dc28f669b184	{"action":"user_signedup","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:19:56.208275+00	
00000000-0000-0000-0000-000000000000	e796ed9f-76da-4c99-9e38-1436a68d6e67	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:19:56.218469+00	
00000000-0000-0000-0000-000000000000	b2abfa49-c5a1-48cc-beaa-0def3d4ce312	{"action":"user_signedup","actor_id":"9672eb6f-31b7-40aa-b30f-fad91006dadf","actor_username":"wajeshravani1@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:27:03.773375+00	
00000000-0000-0000-0000-000000000000	6d5b85dd-8ddb-423c-8566-7861a3a41ad3	{"action":"login","actor_id":"9672eb6f-31b7-40aa-b30f-fad91006dadf","actor_username":"wajeshravani1@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:27:03.783576+00	
00000000-0000-0000-0000-000000000000	bfa3998e-89f3-4271-9b55-dfb87ce29ebd	{"action":"user_signedup","actor_id":"023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7","actor_username":"dbharati5162@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:40:51.762683+00	
00000000-0000-0000-0000-000000000000	62a16258-653f-40da-ae87-6c2dcb39b099	{"action":"login","actor_id":"023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7","actor_username":"dbharati5162@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:40:51.772816+00	
00000000-0000-0000-0000-000000000000	bf7109cd-7b34-49bb-92c0-676ef21f0885	{"action":"user_signedup","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-08-26 16:49:46.435399+00	
00000000-0000-0000-0000-000000000000	395206ff-d60d-45c6-90f9-a12be676c84b	{"action":"login","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 16:49:46.446164+00	
00000000-0000-0000-0000-000000000000	6e990a33-6ebe-42da-98c9-078ab3490847	{"action":"login","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 17:45:29.346186+00	
00000000-0000-0000-0000-000000000000	41586a41-3222-4e49-a7bf-41e7603ce5c8	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"instant_user_1787760183293@avishkark.in","user_id":"1ce93a23-73dc-401c-9fce-a29ccd85d76b","user_phone":""}}	2026-08-26 18:31:59.432059+00	
00000000-0000-0000-0000-000000000000	770ce91c-c6dc-4027-93ca-98734199d038	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"instant_user_1787760299769@avishkark.in","user_id":"eea42e7e-ade9-4fda-8ae9-aa9e364f9453","user_phone":""}}	2026-08-26 18:31:59.433045+00	
00000000-0000-0000-0000-000000000000	d2a22ac8-5550-4fd4-a740-b523112472b4	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test_verify_user@avishkark.in","user_id":"0c188244-1178-4d8e-98a5-a64e47c60902","user_phone":""}}	2026-08-26 18:31:59.526306+00	
00000000-0000-0000-0000-000000000000	cbaed8a3-ef90-4fd5-ab90-22f6a2501a8d	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"realbrowser_1787760722388@avishkark.in","user_id":"9ace3578-5418-4a64-a9f4-41ecdb5fd2c4","user_phone":""}}	2026-08-26 18:31:59.549059+00	
00000000-0000-0000-0000-000000000000	0da2e573-5c30-41b7-9b58-9236336bbd52	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"testpilot_1787760958305@avishkark.in","user_id":"dd4c0101-ec78-41fd-bb53-f81c53b3e3d2","user_phone":""}}	2026-08-26 18:31:59.553627+00	
00000000-0000-0000-0000-000000000000	c8b20cb1-4261-4003-b85a-3131a8f3dd7a	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user_1787760096793@avishkark.in","user_id":"13fefb00-4206-4063-b0d2-e89b830d8fa5","user_phone":""}}	2026-08-26 18:31:59.561174+00	
00000000-0000-0000-0000-000000000000	5529e22d-3aa9-4141-b281-77c80d80187b	{"action":"login","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 18:40:18.446847+00	
00000000-0000-0000-0000-000000000000	3922723e-6245-423a-8080-2ab5e381b580	{"action":"login","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 18:41:59.77506+00	
00000000-0000-0000-0000-000000000000	ddce958e-2902-4b6a-921f-e479ea2617bc	{"action":"user_confirmation_requested","actor_id":"273a46f5-6a6c-4b8c-a7de-3ad9134b0837","actor_name":"Avishkar Trainee","actor_username":"realauth_1787770074790@avishkark.in","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-08-26 18:47:55.532493+00	
00000000-0000-0000-0000-000000000000	8d7bab05-f6eb-4cef-af6a-2d433a45f6dd	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"testofficer@mssds.gov.in","user_id":"49e19dee-33df-43f4-9216-dbb8a3b7f0f2","user_phone":""}}	2026-08-26 19:31:39.837977+00	
00000000-0000-0000-0000-000000000000	098d1a84-f02c-43b3-a6b1-af6f83575b93	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"pune.officer@mssds.gov.in","user_id":"002a098c-755c-4cb5-b54c-fead93545fd5","user_phone":""}}	2026-08-26 19:32:09.192738+00	
00000000-0000-0000-0000-000000000000	4915645d-8635-4b7d-a6eb-b7a17db5cc99	{"action":"login","actor_id":"a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 19:50:54.050377+00	
00000000-0000-0000-0000-000000000000	74b0180e-3a61-4806-b5e5-d785f649a8b0	{"action":"login","actor_id":"b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e","actor_name":"Super Administrator","actor_username":"admin@nexus.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-26 19:50:54.412297+00	
00000000-0000-0000-0000-000000000000	e452a1ed-ee0b-49be-b2e1-f32f8add4121	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"priya.sharma@mahaskill.in","user_id":"a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d","user_phone":""}}	2026-08-27 03:32:34.453808+00	
00000000-0000-0000-0000-000000000000	d58fa7cd-4d3e-4e42-b9ce-c0ad2c8dcbdf	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"testofficer@mssds.gov.in","user_id":"49e19dee-33df-43f4-9216-dbb8a3b7f0f2","user_phone":""}}	2026-08-27 03:32:34.459425+00	
00000000-0000-0000-0000-000000000000	f56f0b66-62f9-442b-9657-fd584f2a70e8	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"realauth_1787770074790@avishkark.in","user_id":"273a46f5-6a6c-4b8c-a7de-3ad9134b0837","user_phone":""}}	2026-08-27 03:32:34.460069+00	
00000000-0000-0000-0000-000000000000	eb7aef9d-6133-42c7-bec0-26411dddd21b	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"pune.officer@mssds.gov.in","user_id":"002a098c-755c-4cb5-b54c-fead93545fd5","user_phone":""}}	2026-08-27 03:32:34.463357+00	
00000000-0000-0000-0000-000000000000	92600b63-eceb-4a06-9272-9b96040d5ad7	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 03:59:57.018066+00	
00000000-0000-0000-0000-000000000000	417d9272-38e2-4f67-bd0b-eb8b6d665ceb	{"action":"login","actor_id":"b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e","actor_name":"Super Administrator","actor_username":"admin@nexus.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 04:00:02.534514+00	
00000000-0000-0000-0000-000000000000	2b060c5c-75c5-4e23-bc6d-7bbefdcefb2a	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 04:07:19.596958+00	
00000000-0000-0000-0000-000000000000	ecdfd94c-9250-43ca-b9b9-07d7957fc31e	{"action":"token_refreshed","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 05:00:17.277032+00	
00000000-0000-0000-0000-000000000000	d152d87f-368d-45b7-bca0-6158a1b14af0	{"action":"token_revoked","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 05:00:17.27787+00	
00000000-0000-0000-0000-000000000000	1dab5ce8-f9d5-4de2-98bd-f46217934487	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 05:00:26.983256+00	
00000000-0000-0000-0000-000000000000	20307f56-79fa-4ea5-a5c8-7a02206fc196	{"action":"token_refreshed","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 05:23:32.519338+00	
00000000-0000-0000-0000-000000000000	1391128f-35f7-4a47-a1b5-2719ac471528	{"action":"token_revoked","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 05:23:32.520151+00	
00000000-0000-0000-0000-000000000000	9bdfd94f-c762-4cc4-9b02-f45c4e1eb5ac	{"action":"token_refreshed","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 05:23:32.628999+00	
00000000-0000-0000-0000-000000000000	80cc6496-60fe-48d2-9b86-021b7c8bff1d	{"action":"user_repeated_signup","actor_id":"f9c7185f-8011-41aa-bdab-0851f6cecbc8","actor_username":"aryakulkarni999@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-08-27 05:24:04.08492+00	
00000000-0000-0000-0000-000000000000	beb0c33a-c13e-40d1-8e1a-7e8dfa12d235	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 05:29:39.371367+00	
00000000-0000-0000-0000-000000000000	e905620e-b65f-44f2-a87e-f4bbf882293a	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 06:39:01.687493+00	
00000000-0000-0000-0000-000000000000	3d8c7912-0346-47de-8c77-cdb5515f62ed	{"action":"logout","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-08-27 06:39:56.4039+00	
00000000-0000-0000-0000-000000000000	bc97c3c4-cc15-401f-8667-ad6a6675e38f	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:04:44.863232+00	
00000000-0000-0000-0000-000000000000	6da7bff1-0ae5-4d96-b6e0-ff57a38316a6	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:09:49.390001+00	
00000000-0000-0000-0000-000000000000	7abf5f7e-ba2d-4986-aba9-fcc5b54db2a4	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:19:05.481034+00	
00000000-0000-0000-0000-000000000000	47aaacb7-3e35-4ff2-afd1-da520edb05c4	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:42:16.455993+00	
00000000-0000-0000-0000-000000000000	2314fbd9-6919-44a4-83fa-45430be3ead2	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:42:36.216001+00	
00000000-0000-0000-0000-000000000000	87e8225f-3759-465e-a244-bb783eec3c9d	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:43:36.60868+00	
00000000-0000-0000-0000-000000000000	943ec555-d105-4983-ac9a-db576793e694	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:44:32.74886+00	
00000000-0000-0000-0000-000000000000	1c53708d-1c7a-4580-8cad-ea2d3c6ee131	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:52:32.369279+00	
00000000-0000-0000-0000-000000000000	4cc1214a-ab1c-4d08-a441-86e6ecfae5c8	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 10:53:29.64085+00	
00000000-0000-0000-0000-000000000000	83dad181-b84e-4e41-9ae6-511215c3dc17	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 11:12:29.297613+00	
00000000-0000-0000-0000-000000000000	b30e9aed-88c2-41a9-a3b7-b593b643c3de	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 11:14:37.929618+00	
00000000-0000-0000-0000-000000000000	e09c7d8d-d769-4a4c-98bf-7a46b7d199a9	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 11:15:39.025398+00	
00000000-0000-0000-0000-000000000000	32e70b88-7e14-4aa2-af9a-2c812d4f9b9e	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 11:17:16.811211+00	
00000000-0000-0000-0000-000000000000	c748dd43-ac98-4568-8522-6feb550a682d	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 11:18:17.685209+00	
00000000-0000-0000-0000-000000000000	102709bf-1d2a-474e-9786-22663d9f5cae	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 11:25:37.857976+00	
00000000-0000-0000-0000-000000000000	12109a7a-4b11-4a56-8e0d-17618a52e861	{"action":"token_refreshed","actor_id":"023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7","actor_username":"dbharati5162@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:05:49.959424+00	
00000000-0000-0000-0000-000000000000	d0b58030-37b1-4096-b98d-9dc3be244940	{"action":"token_revoked","actor_id":"023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7","actor_username":"dbharati5162@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:05:49.960335+00	
00000000-0000-0000-0000-000000000000	87f4e7fe-c94a-4ee4-959f-26dca4f61f8e	{"action":"token_refreshed","actor_id":"023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7","actor_username":"dbharati5162@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:05:50.043734+00	
00000000-0000-0000-0000-000000000000	fa9f3dea-7e56-49f3-a8c3-bb52a7e3af6d	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:07:40.327654+00	
00000000-0000-0000-0000-000000000000	86c5dde7-aa7c-48ab-8d93-0c4a8b22126e	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:09:23.901085+00	
00000000-0000-0000-0000-000000000000	642c12e6-ba8e-41ea-bc68-67c11231850b	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:09:47.97361+00	
00000000-0000-0000-0000-000000000000	b7d3c707-417f-423d-a4be-821633b8acbb	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:10:14.265657+00	
00000000-0000-0000-0000-000000000000	fc2bdf7a-1a48-4f6e-b9b7-adf1b20eed5e	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:11:46.583531+00	
00000000-0000-0000-0000-000000000000	cb8a8151-6541-48ab-81fc-fe973b2a2f90	{"action":"token_refreshed","actor_id":"9672eb6f-31b7-40aa-b30f-fad91006dadf","actor_username":"wajeshravani1@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:26:57.110637+00	
00000000-0000-0000-0000-000000000000	acb9b6af-ac53-4f5c-b865-26bc882fdd9f	{"action":"token_revoked","actor_id":"9672eb6f-31b7-40aa-b30f-fad91006dadf","actor_username":"wajeshravani1@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:26:57.111629+00	
00000000-0000-0000-0000-000000000000	2012b63f-4dfc-42e1-b825-f7d6e4a983a8	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:29:37.493217+00	
00000000-0000-0000-0000-000000000000	4ceafc06-0b85-42f6-9223-1e6a4d6cf228	{"action":"token_refreshed","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:38:28.086748+00	
00000000-0000-0000-0000-000000000000	a800ce04-f87c-4764-81ba-9eca1e1abe70	{"action":"token_revoked","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:38:28.087621+00	
00000000-0000-0000-0000-000000000000	35373923-1b4b-4fe4-a490-eada1357182f	{"action":"token_refreshed","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 12:38:28.257207+00	
00000000-0000-0000-0000-000000000000	fac6bf1e-1100-4e6e-94e3-c5cb81b97a6b	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:38:45.767829+00	
00000000-0000-0000-0000-000000000000	d792e58b-ab20-4497-ba08-3c702d7fd6fe	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:41:07.424247+00	
00000000-0000-0000-0000-000000000000	310ff4ae-8007-4ec7-b3be-7044a8277090	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:41:21.463629+00	
00000000-0000-0000-0000-000000000000	4ffecbc0-12a6-4c0b-8685-b9ec89198418	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:50:02.855803+00	
00000000-0000-0000-0000-000000000000	c849fa37-9e0a-43a6-8d20-6bafa7e6bc18	{"action":"login","actor_id":"8db21243-0294-4d8f-b6fd-a77ee675de65","actor_name":"Priya Sharma","actor_username":"priya.sharma@mahaskill.in","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 12:54:12.010058+00	
00000000-0000-0000-0000-000000000000	d191fa0a-a4f2-4bea-a809-b313aa437f69	{"action":"token_refreshed","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 14:03:31.910826+00	
00000000-0000-0000-0000-000000000000	ff8280ad-8fc5-4ad7-a79a-34c1281d05ea	{"action":"token_revoked","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 14:03:31.911594+00	
00000000-0000-0000-0000-000000000000	c72dfb0b-f554-4713-b2fa-38b1c99e1333	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 14:04:20.814411+00	
00000000-0000-0000-0000-000000000000	43a7f265-56b2-4164-99ea-eaf46a2ad26e	{"action":"token_refreshed","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 15:07:44.458043+00	
00000000-0000-0000-0000-000000000000	0c553f4f-44f1-4507-bd2a-317f434b410a	{"action":"token_revoked","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-08-27 15:07:44.45888+00	
00000000-0000-0000-0000-000000000000	e8168d21-651e-4bf9-99f2-5302783be362	{"action":"login","actor_id":"6d1e454b-d7d1-41d3-a9f3-198e3a687b3e","actor_username":"avishkarkedar@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-08-27 15:07:46.541181+00	
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	{"sub": "6d1e454b-d7d1-41d3-a9f3-198e3a687b3e", "email": "avishkarkedar@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-08-26 16:19:56.205749+00	2026-08-26 16:19:56.205795+00	2026-08-26 16:19:56.205795+00	131e00cc-8713-4951-8c6f-0ac90d80ef45
9672eb6f-31b7-40aa-b30f-fad91006dadf	9672eb6f-31b7-40aa-b30f-fad91006dadf	{"sub": "9672eb6f-31b7-40aa-b30f-fad91006dadf", "email": "wajeshravani1@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-08-26 16:27:03.771014+00	2026-08-26 16:27:03.771054+00	2026-08-26 16:27:03.771054+00	3674300e-608a-4be2-b8e4-6f1ac1a68201
023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	{"sub": "023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7", "email": "dbharati5162@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-08-26 16:40:51.760336+00	2026-08-26 16:40:51.76038+00	2026-08-26 16:40:51.76038+00	b5c80991-1146-4493-b8d5-5e05b519bb3f
f9c7185f-8011-41aa-bdab-0851f6cecbc8	f9c7185f-8011-41aa-bdab-0851f6cecbc8	{"sub": "f9c7185f-8011-41aa-bdab-0851f6cecbc8", "email": "aryakulkarni999@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-08-26 16:49:46.432889+00	2026-08-26 16:49:46.43293+00	2026-08-26 16:49:46.43293+00	51890218-8237-41de-a8f2-7eacf0d091a0
8db21243-0294-4d8f-b6fd-a77ee675de65	8db21243-0294-4d8f-b6fd-a77ee675de65	{"sub": "8db21243-0294-4d8f-b6fd-a77ee675de65", "email": "priya.sharma@mahaskill.in", "email_verified": true, "phone_verified": false}	email	2026-08-27 03:59:51.091205+00	2026-08-27 03:59:51.091205+00	2026-08-27 03:59:51.091205+00	8db21243-0294-4d8f-b6fd-a77ee675de65
b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	{"sub": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e", "email": "admin@nexus.com", "email_verified": true, "phone_verified": false}	email	2026-08-27 03:59:51.215735+00	2026-08-27 03:59:51.215735+00	2026-08-27 03:59:51.215735+00	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
2429f146-cc28-4f32-8907-0546c600fd4f	2026-08-26 16:27:03.788432+00	2026-08-26 16:27:03.788432+00	password	5894cf95-5901-42c3-8d73-9bfe913235dc
89af9aa1-822d-4c7d-9b66-0a4408b94af6	2026-08-26 16:40:51.77757+00	2026-08-26 16:40:51.77757+00	password	9936d3be-6eb3-4f36-9acc-35eb017ab3af
a16a78c1-61ec-4096-aaff-a1576112194c	2026-08-26 16:49:46.451389+00	2026-08-26 16:49:46.451389+00	password	7368774f-27d1-4ac5-9dec-bf7e1ba1ecc1
68c7c1e7-3d98-4c5c-b353-7dd171355543	2026-08-26 17:45:29.351259+00	2026-08-26 17:45:29.351259+00	password	8505a8e1-d6cb-42f3-8b78-c37d21a69fe6
8abc44e2-0d64-4d39-bdd2-534a766ae0c4	2026-08-26 18:40:18.451907+00	2026-08-26 18:40:18.451907+00	password	1ffb7bdd-546c-4544-b5a0-3962679729ed
b52894fe-27ca-47a0-b57b-8fcaa51226cb	2026-08-26 18:41:59.780215+00	2026-08-26 18:41:59.780215+00	password	c7dabdc0-d77d-4be1-8ba7-c449bbb83a9f
5c6cec41-fc99-4d4d-8640-fec0b29e1510	2026-08-26 19:50:54.417283+00	2026-08-26 19:50:54.417283+00	password	a030a655-445c-4e35-9908-d8f6e701d2e2
aa5dc9a4-d99c-459f-a5cd-90c5b4dbdf17	2026-08-27 03:59:57.02335+00	2026-08-27 03:59:57.02335+00	password	5e40dad5-e9c6-4302-8b4a-ea45412edec3
9c1cdeb2-7434-46b1-860a-0976a09a899e	2026-08-27 04:00:02.539712+00	2026-08-27 04:00:02.539712+00	password	3282c3ba-474c-4cf6-a6de-03b66d85e4ba
7de9cf2c-7587-406f-8e70-817ba717dc0f	2026-08-27 04:07:19.602093+00	2026-08-27 04:07:19.602093+00	password	768fc4ee-5a9c-45cf-ba7e-1ab81fe4df73
408abf64-f74e-4c6e-8824-d01c3d672f3d	2026-08-27 10:04:44.868188+00	2026-08-27 10:04:44.868188+00	password	6dc4751a-7310-47ad-9733-8501e81f9de3
e9c9c514-f833-4a82-b477-05815a59ab2f	2026-08-27 10:09:49.395105+00	2026-08-27 10:09:49.395105+00	password	c897a33c-c629-40e5-9905-7165eeff165e
3b4cb5d4-4ec5-42c1-ab4e-661e3e571ee8	2026-08-27 10:19:05.487889+00	2026-08-27 10:19:05.487889+00	password	48eab32b-dc7c-49f3-aa36-091f0df64c29
9778b8b5-a2e0-43b0-a3b5-009481e2678d	2026-08-27 10:42:16.460996+00	2026-08-27 10:42:16.460996+00	password	e7e6275f-1121-4768-9f19-9bf09825008c
f313d208-d25a-4f9b-9e10-100032d3d35b	2026-08-27 10:42:36.221896+00	2026-08-27 10:42:36.221896+00	password	5719bf59-ec09-42ce-9c2a-35f4935b7142
a7cc3dfa-1e6a-48e0-bed9-cad220768652	2026-08-27 10:43:36.614081+00	2026-08-27 10:43:36.614081+00	password	837d8dc7-4c25-46e3-bb7a-da6419f896f9
9666703f-a24c-4fdf-9946-9c07644ad513	2026-08-27 10:44:32.753997+00	2026-08-27 10:44:32.753997+00	password	c1e3605e-90ac-49f8-bb01-98ce25f61a4d
2bdda42a-8d2e-4b01-948b-8f4b91f24324	2026-08-27 10:52:32.374443+00	2026-08-27 10:52:32.374443+00	password	33732fbe-d019-47f7-a408-c45c4f7edcca
79f3cf33-09e5-41f4-9256-5ca5f21cd9b8	2026-08-27 10:53:29.646716+00	2026-08-27 10:53:29.646716+00	password	4611dcb2-83d2-408e-a14b-6aabf5b52a6a
a5d010e5-20e0-4d6b-bc61-bb3aa21a7c18	2026-08-27 11:12:29.302904+00	2026-08-27 11:12:29.302904+00	password	7aa16dcb-e5c4-4822-bb59-407f1ab3fd51
a4298e0c-d4e2-4c74-a834-a5d6b7ff5d56	2026-08-27 11:14:37.934804+00	2026-08-27 11:14:37.934804+00	password	9b40e444-7f25-4d86-8d16-9788fae91ab7
76bac94f-26ad-444a-a1ce-3d1f930aeb7c	2026-08-27 11:15:39.030681+00	2026-08-27 11:15:39.030681+00	password	ff719a31-9735-44f8-8d8d-69611bee9edf
689cd735-9a62-4854-9cc5-96211864bbc2	2026-08-27 11:17:16.816977+00	2026-08-27 11:17:16.816977+00	password	e9927f59-2bf3-47ba-8c0b-9c7467b29a0c
0d612244-f55c-4c62-92a8-c0afadeda097	2026-08-27 11:18:17.69041+00	2026-08-27 11:18:17.69041+00	password	dc6d8197-de1d-46a4-96ce-3c302a879b41
883b22bf-a143-4181-8872-6c640b8aa045	2026-08-27 11:25:37.863432+00	2026-08-27 11:25:37.863432+00	password	d0764e4d-2e38-446f-8df2-3a9c6f29d7ce
e873027b-cc76-4b96-b7ee-99cf9df6ab74	2026-08-27 12:07:40.332954+00	2026-08-27 12:07:40.332954+00	password	4d4d8f61-d984-4e59-ab46-b12ade33d868
30a047c4-4616-4121-b721-95261e1641cf	2026-08-27 12:09:23.906518+00	2026-08-27 12:09:23.906518+00	password	0b0c9502-1049-4848-8680-003d6ab3ddb5
0d6612e7-a25c-4d01-bbe3-844b75db2b0b	2026-08-27 12:09:47.979263+00	2026-08-27 12:09:47.979263+00	password	d8dde06c-5aff-437a-979c-e6bd478beaae
3b166f2d-4e8c-4e66-9842-3e81c8c1cd9a	2026-08-27 12:10:14.271985+00	2026-08-27 12:10:14.271985+00	password	25e03060-b6b3-4306-bc87-95ba819eabe7
cba3e64d-8a70-457e-8ae4-95e05be32533	2026-08-27 12:11:46.588979+00	2026-08-27 12:11:46.588979+00	password	d237253f-518e-4fda-a419-60bd9492ed53
1687e869-e6df-4e85-a477-467895f5003f	2026-08-27 12:29:37.498319+00	2026-08-27 12:29:37.498319+00	password	0ebdaad7-d729-46ef-aafe-2d837e5421a4
d3fb3549-59f3-4607-8b21-cadfd2f38630	2026-08-27 12:38:45.773927+00	2026-08-27 12:38:45.773927+00	password	c6c8e274-6bed-4233-abbb-a28284ea9a7e
7ff450c8-7b96-4013-968d-80dd1cf79ff1	2026-08-27 12:41:07.429342+00	2026-08-27 12:41:07.429342+00	password	d9905c82-a196-43d0-9582-9dd922d376ec
8d3bef8b-389b-4a22-8436-4149780b473b	2026-08-27 12:41:21.468652+00	2026-08-27 12:41:21.468652+00	password	26d007dd-3c3d-431b-b512-04c2eab6bc98
eb231568-2cf5-49f2-a25b-e9b2aa54927d	2026-08-27 12:50:02.860984+00	2026-08-27 12:50:02.860984+00	password	6ef9feb1-39b9-48ec-a822-ad43e3f35422
d3383672-b312-447e-b3bb-1a720ff496eb	2026-08-27 12:54:12.015067+00	2026-08-27 12:54:12.015067+00	password	eae60345-b2ab-4ccb-b255-cf4bcca2572a
f7601f45-511d-4ec3-b13d-2cedda14c923	2026-08-27 14:04:20.820598+00	2026-08-27 14:04:20.820598+00	password	7c86a9df-ccde-415a-a255-4855989d4c5a
18843e30-c14b-426b-980e-7fe9ba9bf35e	2026-08-27 15:07:46.546738+00	2026-08-27 15:07:46.546738+00	password	046be67a-0775-4ed6-88ad-61e8b4c48368
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	9	m4q5rbln2hga	f9c7185f-8011-41aa-bdab-0851f6cecbc8	f	2026-08-26 16:49:46.449644+00	2026-08-26 16:49:46.449644+00	\N	a16a78c1-61ec-4096-aaff-a1576112194c
00000000-0000-0000-0000-000000000000	10	kr6rzbfyie4z	f9c7185f-8011-41aa-bdab-0851f6cecbc8	f	2026-08-26 17:45:29.349402+00	2026-08-26 17:45:29.349402+00	\N	68c7c1e7-3d98-4c5c-b353-7dd171355543
00000000-0000-0000-0000-000000000000	11	wxjzdjbvhyqm	f9c7185f-8011-41aa-bdab-0851f6cecbc8	f	2026-08-26 18:40:18.45009+00	2026-08-26 18:40:18.45009+00	\N	8abc44e2-0d64-4d39-bdd2-534a766ae0c4
00000000-0000-0000-0000-000000000000	14	anrqub2ehbkj	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	f	2026-08-26 19:50:54.415421+00	2026-08-26 19:50:54.415421+00	\N	5c6cec41-fc99-4d4d-8640-fec0b29e1510
00000000-0000-0000-0000-000000000000	15	cepjea5qxiab	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 03:59:57.021527+00	2026-08-27 03:59:57.021527+00	\N	aa5dc9a4-d99c-459f-a5cd-90c5b4dbdf17
00000000-0000-0000-0000-000000000000	16	vonfudqebqak	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	f	2026-08-27 04:00:02.537867+00	2026-08-27 04:00:02.537867+00	\N	9c1cdeb2-7434-46b1-860a-0976a09a899e
00000000-0000-0000-0000-000000000000	17	z5pwk2tnn3zr	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 04:07:19.600131+00	2026-08-27 04:07:19.600131+00	\N	7de9cf2c-7587-406f-8e70-817ba717dc0f
00000000-0000-0000-0000-000000000000	12	ekixzszg377n	f9c7185f-8011-41aa-bdab-0851f6cecbc8	t	2026-08-26 18:41:59.778375+00	2026-08-27 05:23:32.520615+00	\N	b52894fe-27ca-47a0-b57b-8fcaa51226cb
00000000-0000-0000-0000-000000000000	20	iolu7qiseioh	f9c7185f-8011-41aa-bdab-0851f6cecbc8	f	2026-08-27 05:23:32.521204+00	2026-08-27 05:23:32.521204+00	ekixzszg377n	b52894fe-27ca-47a0-b57b-8fcaa51226cb
00000000-0000-0000-0000-000000000000	23	gmesbfg5jn5i	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:04:44.866418+00	2026-08-27 10:04:44.866418+00	\N	408abf64-f74e-4c6e-8824-d01c3d672f3d
00000000-0000-0000-0000-000000000000	24	7p76ylr43lgo	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 10:09:49.393306+00	2026-08-27 10:09:49.393306+00	\N	e9c9c514-f833-4a82-b477-05815a59ab2f
00000000-0000-0000-0000-000000000000	25	uvaoeaqxxpe2	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:19:05.48434+00	2026-08-27 10:19:05.48434+00	\N	3b4cb5d4-4ec5-42c1-ab4e-661e3e571ee8
00000000-0000-0000-0000-000000000000	26	sahtstno6mdi	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:42:16.459218+00	2026-08-27 10:42:16.459218+00	\N	9778b8b5-a2e0-43b0-a3b5-009481e2678d
00000000-0000-0000-0000-000000000000	27	e4fqcbydqwlr	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:42:36.219217+00	2026-08-27 10:42:36.219217+00	\N	f313d208-d25a-4f9b-9e10-100032d3d35b
00000000-0000-0000-0000-000000000000	28	tidbg6yfod3g	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:43:36.612083+00	2026-08-27 10:43:36.612083+00	\N	a7cc3dfa-1e6a-48e0-bed9-cad220768652
00000000-0000-0000-0000-000000000000	29	6lhs6cro5eiu	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:44:32.752155+00	2026-08-27 10:44:32.752155+00	\N	9666703f-a24c-4fdf-9946-9c07644ad513
00000000-0000-0000-0000-000000000000	30	klllgaibq7po	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:52:32.372589+00	2026-08-27 10:52:32.372589+00	\N	2bdda42a-8d2e-4b01-948b-8f4b91f24324
00000000-0000-0000-0000-000000000000	31	liz4h45nlcbe	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 10:53:29.644333+00	2026-08-27 10:53:29.644333+00	\N	79f3cf33-09e5-41f4-9256-5ca5f21cd9b8
00000000-0000-0000-0000-000000000000	32	t7gx23ipur5d	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 11:12:29.301037+00	2026-08-27 11:12:29.301037+00	\N	a5d010e5-20e0-4d6b-bc61-bb3aa21a7c18
00000000-0000-0000-0000-000000000000	33	xm3gbtbsvnmv	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 11:14:37.932921+00	2026-08-27 11:14:37.932921+00	\N	a4298e0c-d4e2-4c74-a834-a5d6b7ff5d56
00000000-0000-0000-0000-000000000000	34	zudn4dbwzns5	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 11:15:39.02887+00	2026-08-27 11:15:39.02887+00	\N	76bac94f-26ad-444a-a1ce-3d1f930aeb7c
00000000-0000-0000-0000-000000000000	35	whjlzwtdtdug	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 11:17:16.814752+00	2026-08-27 11:17:16.814752+00	\N	689cd735-9a62-4854-9cc5-96211864bbc2
00000000-0000-0000-0000-000000000000	36	xaqbrz2xgvgp	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 11:18:17.688453+00	2026-08-27 11:18:17.688453+00	\N	0d612244-f55c-4c62-92a8-c0afadeda097
00000000-0000-0000-0000-000000000000	8	ztf6vomdii5z	023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	t	2026-08-26 16:40:51.775851+00	2026-08-27 12:05:49.960927+00	\N	89af9aa1-822d-4c7d-9b66-0a4408b94af6
00000000-0000-0000-0000-000000000000	38	gyvmuwaz75wk	023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	f	2026-08-27 12:05:49.961511+00	2026-08-27 12:05:49.961511+00	ztf6vomdii5z	89af9aa1-822d-4c7d-9b66-0a4408b94af6
00000000-0000-0000-0000-000000000000	39	ignpanmtwdlg	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:07:40.331068+00	2026-08-27 12:07:40.331068+00	\N	e873027b-cc76-4b96-b7ee-99cf9df6ab74
00000000-0000-0000-0000-000000000000	40	rlxmhlios55i	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:09:23.904537+00	2026-08-27 12:09:23.904537+00	\N	30a047c4-4616-4121-b721-95261e1641cf
00000000-0000-0000-0000-000000000000	41	oaverq2fcqkp	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:09:47.977264+00	2026-08-27 12:09:47.977264+00	\N	0d6612e7-a25c-4d01-bbe3-844b75db2b0b
00000000-0000-0000-0000-000000000000	42	fdd3nmf5igeg	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:10:14.269946+00	2026-08-27 12:10:14.269946+00	\N	3b166f2d-4e8c-4e66-9842-3e81c8c1cd9a
00000000-0000-0000-0000-000000000000	7	r2baonya5gru	9672eb6f-31b7-40aa-b30f-fad91006dadf	t	2026-08-26 16:27:03.786728+00	2026-08-27 12:26:57.112158+00	\N	2429f146-cc28-4f32-8907-0546c600fd4f
00000000-0000-0000-0000-000000000000	44	leq6orj7lgfr	9672eb6f-31b7-40aa-b30f-fad91006dadf	f	2026-08-27 12:26:57.112812+00	2026-08-27 12:26:57.112812+00	r2baonya5gru	2429f146-cc28-4f32-8907-0546c600fd4f
00000000-0000-0000-0000-000000000000	45	5gyakq6gdnzg	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:29:37.496526+00	2026-08-27 12:29:37.496526+00	\N	1687e869-e6df-4e85-a477-467895f5003f
00000000-0000-0000-0000-000000000000	37	mujx6whqkz4v	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	t	2026-08-27 11:25:37.861676+00	2026-08-27 12:38:28.088079+00	\N	883b22bf-a143-4181-8872-6c640b8aa045
00000000-0000-0000-0000-000000000000	46	2fc4onjkrwcc	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:38:28.088661+00	2026-08-27 12:38:28.088661+00	mujx6whqkz4v	883b22bf-a143-4181-8872-6c640b8aa045
00000000-0000-0000-0000-000000000000	47	5ggvnwtb4u2a	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:38:45.771255+00	2026-08-27 12:38:45.771255+00	\N	d3fb3549-59f3-4607-8b21-cadfd2f38630
00000000-0000-0000-0000-000000000000	48	ohrl65znzb6u	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:41:07.427508+00	2026-08-27 12:41:07.427508+00	\N	7ff450c8-7b96-4013-968d-80dd1cf79ff1
00000000-0000-0000-0000-000000000000	49	6yxgwusxrc5r	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:41:21.466905+00	2026-08-27 12:41:21.466905+00	\N	8d3bef8b-389b-4a22-8436-4149780b473b
00000000-0000-0000-0000-000000000000	50	aysifrichpng	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 12:50:02.859102+00	2026-08-27 12:50:02.859102+00	\N	eb231568-2cf5-49f2-a25b-e9b2aa54927d
00000000-0000-0000-0000-000000000000	51	flai6xbu24nv	8db21243-0294-4d8f-b6fd-a77ee675de65	f	2026-08-27 12:54:12.013293+00	2026-08-27 12:54:12.013293+00	\N	d3383672-b312-447e-b3bb-1a720ff496eb
00000000-0000-0000-0000-000000000000	43	qkwalvbewpyg	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	t	2026-08-27 12:11:46.586993+00	2026-08-27 14:03:31.912075+00	\N	cba3e64d-8a70-457e-8ae4-95e05be32533
00000000-0000-0000-0000-000000000000	52	3zysjj76mnsm	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 14:03:31.912639+00	2026-08-27 14:03:31.912639+00	qkwalvbewpyg	cba3e64d-8a70-457e-8ae4-95e05be32533
00000000-0000-0000-0000-000000000000	53	bj7f56gbvrhc	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	t	2026-08-27 14:04:20.818586+00	2026-08-27 15:07:44.459424+00	\N	f7601f45-511d-4ec3-b13d-2cedda14c923
00000000-0000-0000-0000-000000000000	54	6tiazsy5bpdp	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 15:07:44.462427+00	2026-08-27 15:07:44.462427+00	bj7f56gbvrhc	f7601f45-511d-4ec3-b13d-2cedda14c923
00000000-0000-0000-0000-000000000000	55	pwmoewtegefq	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	f	2026-08-27 15:07:46.54481+00	2026-08-27 15:07:46.54481+00	\N	18843e30-c14b-426b-980e-7fe9ba9bf35e
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
a16a78c1-61ec-4096-aaff-a1576112194c	f9c7185f-8011-41aa-bdab-0851f6cecbc8	2026-08-26 16:49:46.447686+00	2026-08-26 16:49:46.447686+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	162.159.122.190	\N	\N	\N	\N	\N
68c7c1e7-3d98-4c5c-b353-7dd171355543	f9c7185f-8011-41aa-bdab-0851f6cecbc8	2026-08-26 17:45:29.347455+00	2026-08-26 17:45:29.347455+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	172.68.234.46	\N	\N	\N	\N	\N
8abc44e2-0d64-4d39-bdd2-534a766ae0c4	f9c7185f-8011-41aa-bdab-0851f6cecbc8	2026-08-26 18:40:18.448122+00	2026-08-26 18:40:18.448122+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	162.159.122.101	\N	\N	\N	\N	\N
5c6cec41-fc99-4d4d-8640-fec0b29e1510	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	2026-08-26 19:50:54.413568+00	2026-08-26 19:50:54.413568+00	\N	aal1	\N	\N	node	162.159.122.191	\N	\N	\N	\N	\N
aa5dc9a4-d99c-459f-a5cd-90c5b4dbdf17	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 03:59:57.019503+00	2026-08-27 03:59:57.019503+00	\N	aal1	\N	\N	node	172.68.234.230	\N	\N	\N	\N	\N
9c1cdeb2-7434-46b1-860a-0976a09a899e	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	2026-08-27 04:00:02.535907+00	2026-08-27 04:00:02.535907+00	\N	aal1	\N	\N	node	172.68.234.230	\N	\N	\N	\N	\N
7de9cf2c-7587-406f-8e70-817ba717dc0f	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 04:07:19.598206+00	2026-08-27 04:07:19.598206+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.70.108.7	\N	\N	\N	\N	\N
883b22bf-a143-4181-8872-6c640b8aa045	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 11:25:37.859638+00	2026-08-27 12:38:28.258502+00	\N	aal1	\N	2026-08-27 12:38:28.258425	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	162.158.23.214	\N	\N	\N	\N	\N
b52894fe-27ca-47a0-b57b-8fcaa51226cb	f9c7185f-8011-41aa-bdab-0851f6cecbc8	2026-08-26 18:41:59.776362+00	2026-08-27 05:23:32.630432+00	\N	aal1	\N	2026-08-27 05:23:32.630356	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	172.71.152.48	\N	\N	\N	\N	\N
408abf64-f74e-4c6e-8824-d01c3d672f3d	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:04:44.864506+00	2026-08-27 10:04:44.864506+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.68.234.47	\N	\N	\N	\N	\N
e9c9c514-f833-4a82-b477-05815a59ab2f	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 10:09:49.391329+00	2026-08-27 10:09:49.391329+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	172.70.108.7	\N	\N	\N	\N	\N
3b4cb5d4-4ec5-42c1-ab4e-661e3e571ee8	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:19:05.48234+00	2026-08-27 10:19:05.48234+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.68.234.231	\N	\N	\N	\N	\N
9778b8b5-a2e0-43b0-a3b5-009481e2678d	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:42:16.457283+00	2026-08-27 10:42:16.457283+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.68.234.230	\N	\N	\N	\N	\N
f313d208-d25a-4f9b-9e10-100032d3d35b	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:42:36.217337+00	2026-08-27 10:42:36.217337+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	162.159.124.44	\N	\N	\N	\N	\N
a7cc3dfa-1e6a-48e0-bed9-cad220768652	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:43:36.610021+00	2026-08-27 10:43:36.610021+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.70.108.6	\N	\N	\N	\N	\N
9666703f-a24c-4fdf-9946-9c07644ad513	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:44:32.750122+00	2026-08-27 10:44:32.750122+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.70.108.6	\N	\N	\N	\N	\N
2bdda42a-8d2e-4b01-948b-8f4b91f24324	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:52:32.370578+00	2026-08-27 10:52:32.370578+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.68.234.231	\N	\N	\N	\N	\N
79f3cf33-09e5-41f4-9256-5ca5f21cd9b8	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 10:53:29.642218+00	2026-08-27 10:53:29.642218+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	162.159.122.191	\N	\N	\N	\N	\N
a5d010e5-20e0-4d6b-bc61-bb3aa21a7c18	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 11:12:29.298972+00	2026-08-27 11:12:29.298972+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.68.234.230	\N	\N	\N	\N	\N
a4298e0c-d4e2-4c74-a834-a5d6b7ff5d56	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 11:14:37.930946+00	2026-08-27 11:14:37.930946+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	162.159.122.190	\N	\N	\N	\N	\N
76bac94f-26ad-444a-a1ce-3d1f930aeb7c	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 11:15:39.026745+00	2026-08-27 11:15:39.026745+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.70.108.7	\N	\N	\N	\N	\N
689cd735-9a62-4854-9cc5-96211864bbc2	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 11:17:16.812718+00	2026-08-27 11:17:16.812718+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	162.158.23.213	\N	\N	\N	\N	\N
0d612244-f55c-4c62-92a8-c0afadeda097	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 11:18:17.686432+00	2026-08-27 11:18:17.686432+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	172.70.108.7	\N	\N	\N	\N	\N
89af9aa1-822d-4c7d-9b66-0a4408b94af6	023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	2026-08-26 16:40:51.774+00	2026-08-27 12:05:50.045319+00	\N	aal1	\N	2026-08-27 12:05:50.045235	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	172.70.108.7	\N	\N	\N	\N	\N
e873027b-cc76-4b96-b7ee-99cf9df6ab74	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:07:40.329015+00	2026-08-27 12:07:40.329015+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.122.190	\N	\N	\N	\N	\N
30a047c4-4616-4121-b721-95261e1641cf	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:09:23.902503+00	2026-08-27 12:09:23.902503+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.122.190	\N	\N	\N	\N	\N
0d6612e7-a25c-4d01-bbe3-844b75db2b0b	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:09:47.975137+00	2026-08-27 12:09:47.975137+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.122.190	\N	\N	\N	\N	\N
3b166f2d-4e8c-4e66-9842-3e81c8c1cd9a	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:10:14.267842+00	2026-08-27 12:10:14.267842+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.122.190	\N	\N	\N	\N	\N
2429f146-cc28-4f32-8907-0546c600fd4f	9672eb6f-31b7-40aa-b30f-fad91006dadf	2026-08-26 16:27:03.784831+00	2026-08-27 12:26:57.115004+00	\N	aal1	\N	2026-08-27 12:26:57.11492	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	172.70.219.235	\N	\N	\N	\N	\N
1687e869-e6df-4e85-a477-467895f5003f	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:29:37.49455+00	2026-08-27 12:29:37.49455+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	162.158.23.214	\N	\N	\N	\N	\N
eb231568-2cf5-49f2-a25b-e9b2aa54927d	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:50:02.85715+00	2026-08-27 12:50:02.85715+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	172.68.234.230	\N	\N	\N	\N	\N
d3fb3549-59f3-4607-8b21-cadfd2f38630	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:38:45.769231+00	2026-08-27 12:38:45.769231+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	172.68.234.230	\N	\N	\N	\N	\N
7ff450c8-7b96-4013-968d-80dd1cf79ff1	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:41:07.425565+00	2026-08-27 12:41:07.425565+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	162.159.122.190	\N	\N	\N	\N	\N
8d3bef8b-389b-4a22-8436-4149780b473b	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:41:21.464896+00	2026-08-27 12:41:21.464896+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	172.70.108.7	\N	\N	\N	\N	\N
d3383672-b312-447e-b3bb-1a720ff496eb	8db21243-0294-4d8f-b6fd-a77ee675de65	2026-08-27 12:54:12.011321+00	2026-08-27 12:54:12.011321+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	162.158.23.213	\N	\N	\N	\N	\N
cba3e64d-8a70-457e-8ae4-95e05be32533	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 12:11:46.584931+00	2026-08-27 14:03:31.9147+00	\N	aal1	\N	2026-08-27 14:03:31.914622	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.122.101	\N	\N	\N	\N	\N
f7601f45-511d-4ec3-b13d-2cedda14c923	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 14:04:20.81632+00	2026-08-27 15:07:44.464953+00	\N	aal1	\N	2026-08-27 15:07:44.464844	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.124.33	\N	\N	\N	\N	\N
18843e30-c14b-426b-980e-7fe9ba9bf35e	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	2026-08-27 15:07:46.54258+00	2026-08-27 15:07:46.54258+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	162.159.124.44	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	authenticated	authenticated	admin@nexus.com	$2a$10$5XnVksdmf7ApCYuFeBuEpOTFjZOO641ss6m13SaHBAWDQnrZQ6fny	2026-08-27 03:59:51.092592+00	\N		\N		\N			\N	2026-08-27 04:00:02.535824+00	{"provider": "email", "providers": ["email"]}	{"username": "superadmin", "full_name": "Super Administrator"}	\N	2026-08-26 19:49:30.175888+00	2026-08-27 04:00:02.539095+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8db21243-0294-4d8f-b6fd-a77ee675de65	authenticated	authenticated	priya.sharma@mahaskill.in	$2a$10$OLN967IdQSLbDO8TkHs0V.MKY0..0D2C9VMzwd0xejfa41/b2kVMq	2026-08-27 03:59:51.024811+00	\N		\N		\N			\N	2026-08-27 12:54:12.01122+00	{"provider": "email", "providers": ["email"]}	{"username": "priya_sharma", "full_name": "Priya Sharma"}	f	2026-08-27 03:59:51.024811+00	2026-08-27 12:54:12.014478+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	authenticated	authenticated	avishkarkedar@gmail.com	$2a$10$dXgU0ylD0Y3K4.TZ2ph/NOAi5qXptQyl1BrMWAl1D8t4AUETi5qrO	2026-08-26 16:19:56.208972+00	\N		\N		\N			\N	2026-08-27 15:07:46.542499+00	{"provider": "email", "providers": ["email"]}	{"sub": "6d1e454b-d7d1-41d3-a9f3-198e3a687b3e", "email": "avishkarkedar@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-08-26 16:19:56.201174+00	2026-08-27 15:07:46.546111+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9672eb6f-31b7-40aa-b30f-fad91006dadf	authenticated	authenticated	wajeshravani1@gmail.com	$2a$10$iCDYwfk8gPFwhS7ael4jlO99GXVtb1a50SBpV3Nc8wShRxlpVPI6K	2026-08-26 16:27:03.774226+00	\N		\N		\N			\N	2026-08-26 16:27:03.784734+00	{"provider": "email", "providers": ["email"]}	{"sub": "9672eb6f-31b7-40aa-b30f-fad91006dadf", "email": "wajeshravani1@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-08-26 16:27:03.766361+00	2026-08-27 12:26:57.113777+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f9c7185f-8011-41aa-bdab-0851f6cecbc8	authenticated	authenticated	aryakulkarni999@gmail.com	$2a$10$4Jj67fAebBLfmMpV57B5OeE6FWb4C9VXDGYyj1sLBOZNeqZGv6hHm	2026-08-26 16:49:46.436051+00	\N		\N		\N			\N	2026-08-26 18:41:59.776281+00	{"provider": "email", "providers": ["email"]}	{"sub": "f9c7185f-8011-41aa-bdab-0851f6cecbc8", "email": "aryakulkarni999@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-08-26 16:49:46.428135+00	2026-08-27 05:23:32.522125+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	authenticated	authenticated	dbharati5162@gmail.com	$2a$10$c5MBF3YG3APrd9BHqJZz9.F3XHoSZ4pEoyes.IKockn48zAxJtk1S	2026-08-26 16:40:51.763326+00	\N		\N		\N			\N	2026-08-26 16:40:51.773912+00	{"provider": "email", "providers": ["email"]}	{"sub": "023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7", "email": "dbharati5162@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-08-26 16:40:51.75595+00	2026-08-27 12:05:49.96242+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: ai_policy_insights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_policy_insights (id, insight_text, target_sector, target_districts, confidence_score, recommended_action, created_date, is_active) FROM stdin;
f9f254ed-d71d-4c46-a91d-886973d31e78	Self-employed micro-tailors in rural Pune experience 3.2x higher wage growth when equipped with digital payments and ONDC cataloging.	Apparel & Fashion	{Pune,Nashik}	95.80	Mandate a 1-week digital commerce module in all Phase-2 tailoring courses.	2026-08-26	t
a0d16aae-8da9-4723-a264-c6ddb73452d5	Solar technicians certified under MSSDS show a 92% retention rate in Vidarbha region with an average salary bump of 35% after 6 months.	Renewable Energy	{Nagpur,Amravati}	94.20	Expand Solar PV training capacity by 40% across Vidarbha industrial clusters.	2026-08-26	t
48d08af6-6b7d-4a0e-8fe0-338cfe17fe89	Self-employed micro-tailors in rural Pune experience 3.2x higher wage growth when equipped with digital payments and ONDC cataloging.	Apparel & Fashion	{Pune,Nashik}	95.80	Mandate a 1-week digital commerce module in all Phase-2 tailoring courses.	2026-08-26	t
0050516b-0168-4f13-867e-a37097356f63	Solar technicians certified under MSSDS show a 92% retention rate in Vidarbha region with an average salary bump of 35% after 6 months.	Renewable Energy	{Nagpur,Amravati}	94.20	Expand Solar PV training capacity by 40% across Vidarbha industrial clusters.	2026-08-26	t
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, admin_email, action, target_entity, target_id, details, ip_address, status, created_at) FROM stdin;
1358d702-a3e8-4d2d-8d02-89493db37e0d	admin@nexus.com	INITIALIZE_SYSTEM	CORE	\N	System initialized with zero-knowledge enclave configuration	\N	Success	2026-08-26 19:26:17.996661+00
934d877d-2ea3-4348-abdd-9786a8357419	admin@nexus.com	PROVISION_ADMIN	USER_ROLES	\N	Superadmin master console activated for admin@nexus.com	\N	Success	2026-08-26 19:26:17.996661+00
bc3315d4-c527-495b-b081-af95bfe02416	admin@nexus.com	VERIFY_INTEGRITY	MSSDS_REGISTRY	\N	Verified cryptographic integrity of State Trainee Hash Registry	\N	Success	2026-08-26 19:26:17.996661+00
6d64221e-5fa7-41f8-b0da-9f44c72bed77	admin@nexus.com	Created new admin: pune.officer@mssds.gov.in	user_roles	002a098c-755c-4cb5-b54c-fead93545fd5	\N	\N	Success	2026-08-26 19:32:09.494944+00
401c0fcf-9181-4b73-b033-e81ef34b4919	admin@nexus.com	DISPATCH_NOTIFICATION	TRAINEE_NOTIFICATIONS	ALL_BROADCAST	Dispatched info notification "" to All Trainees (Broadcast)	\N	Success	2026-08-27 10:43:06.225819+00
186df29f-12e3-4b15-854d-0438bc96087c	admin@nexus.com	UPDATE_SYSTEM_SETTINGS	CONFIGURATION_REGISTRY	\N	Updated white-label branding, survey cadence (7d window), and RBAC policies	\N	Success	2026-08-27 15:31:21.549472+00
ceadc2d7-85b1-4c39-9896-29e0587efea0	admin@nexus.com	DELETE_USER	TRAINEES	\N	Permanently deleted user testofficer@mssds.gov.in	\N	Success	2026-08-27 15:32:23.704494+00
6358cfe6-9def-433e-a9fc-07167001e1a9	admin@nexus.com	DELETE_USER	TRAINEES	\N	Permanently deleted user testofficer@mssds.gov.in	\N	Success	2026-08-27 15:32:24.32167+00
39d5af5c-e55e-47a3-a859-5f08e1170d50	admin@nexus.com	DELETE_USER	TRAINEES	\N	Permanently deleted user pune.officer@mssds.gov.in	\N	Success	2026-08-27 15:32:30.212857+00
0b4f7ae3-cfc4-4d2f-9ef7-09eceb9f19cf	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to in_progress	\N	Success	2026-08-27 15:32:54.453189+00
399f3fc3-d726-4946-9673-be1a9a6131c0	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to in_progress	\N	Success	2026-08-27 15:32:55.642786+00
fa9d2e90-ba5d-430f-980a-50f2a6123498	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to in_progress	\N	Success	2026-08-27 15:32:56.551383+00
74c7d2d7-6611-428d-87f2-94ee6e4ee20e	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to in_progress	\N	Success	2026-08-27 15:33:07.930543+00
f372352e-6158-4772-8c29-3e6012da1099	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to resolved	\N	Success	2026-08-27 15:33:08.865386+00
dc4e5c78-14b0-47a8-bc0b-aca17f94e45f	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to resolved	\N	Success	2026-08-27 15:33:10.860664+00
be76377f-875c-45df-b0aa-9edffccdbecf	admin@nexus.com	UPDATE_SUPPORT_TICKET	SUPPORT_TICKETS	f43daf70-15f6-4f9e-90df-3020050cf2b9	Updated ticket f43daf70-15f6-4f9e-90df-3020050cf2b9 status to resolved	\N	Success	2026-08-27 15:33:12.536069+00
\.


--
-- Data for Name: district_employment_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.district_employment_stats (id, district_name, total_trained, employed_count, self_employed_count, seeking_count, avg_wage, placement_rate, created_at) FROM stdin;
ded29573-5096-4302-ac16-ff86a909a9bf	Pune	4200	2400	1250	550	21500.00	86.90	2026-08-26 18:51:42.979878+00
0831227e-5266-4a2c-9dc6-9c7b1e294125	Nagpur	3100	1650	980	470	18200.00	84.84	2026-08-26 18:51:42.979878+00
55f9b230-220b-4aed-886a-3261bc4e830a	Nashik	2800	1400	920	480	17500.00	82.86	2026-08-26 18:51:42.979878+00
0548665f-00b7-4d42-a9b3-760f55ce4815	Aurangabad (Chhatrapati Sambhajinagar)	2350	1100	810	440	16800.00	81.28	2026-08-26 18:51:42.979878+00
98e60556-f627-4bef-a718-7fadc5faa209	Thane	3800	2200	1100	500	22800.00	86.84	2026-08-26 18:51:42.979878+00
5eb79857-27d4-4aa4-b512-d3f679468972	Pune	4200	2400	1250	550	21500.00	86.90	2026-08-26 19:26:17.959396+00
b3db6852-a14e-40a8-99d1-4b973be85e65	Nagpur	3100	1650	980	470	18200.00	84.84	2026-08-26 19:26:17.959396+00
48a2f08d-bd83-4f29-adbf-cb622fcc9f55	Nashik	2800	1400	920	480	17500.00	82.86	2026-08-26 19:26:17.959396+00
7933ab5a-3d8b-4791-973e-87c2c02b20aa	Aurangabad (Chhatrapati Sambhajinagar)	2350	1100	810	440	16800.00	81.28	2026-08-26 19:26:17.959396+00
f324779c-f781-4a7d-8bed-83537382bf57	Thane	3800	2200	1100	500	22800.00	86.84	2026-08-26 19:26:17.959396+00
4f65c257-4388-4128-8214-d1127595a393	Pune	14250	10680	2450	1120	22400.00	92.14	2026-08-27 10:28:32.23236+00
bbc91881-411f-4729-9b61-9a59aaf3914f	Nagpur	8920	6420	1820	680	18500.00	92.37	2026-08-27 10:28:32.23236+00
37aa8d85-9226-4f57-8a0d-793287d52bf0	Chhatrapati Sambhajinagar	6480	4660	1250	570	17800.00	91.20	2026-08-27 10:28:32.23236+00
f8f73af9-870b-4642-b348-004a6a286147	Nashik	7340	5210	1490	640	19200.00	91.28	2026-08-27 10:28:32.23236+00
4b5271ea-a226-462d-b751-37e5feba4874	Thane	11200	8400	1900	900	23500.00	91.96	2026-08-27 10:28:32.23236+00
4954f263-13c9-4d06-95e8-5f059f9b45d1	Pune	14250	10680	2450	1120	22400.00	92.14	2026-08-27 10:32:50.299954+00
c9aaed9f-3ef9-4166-aaba-981c621a21e0	Nagpur	8920	6420	1820	680	18500.00	92.37	2026-08-27 10:32:50.299954+00
8704b33d-b3c5-443b-aa73-925a213ea941	Chhatrapati Sambhajinagar	6480	4660	1250	570	17800.00	91.20	2026-08-27 10:32:50.299954+00
f1e3d264-fe46-4d27-94e2-7302910aef10	Nashik	7340	5210	1490	640	19200.00	91.28	2026-08-27 10:32:50.299954+00
e90c62b3-f073-43d5-9630-490add69eb81	Thane	11200	8400	1900	900	23500.00	91.96	2026-08-27 10:32:50.299954+00
a8940e64-4938-4c9d-8fe5-1d3d24709d57	Pune	14250	10680	2450	1120	22400.00	92.14	2026-08-27 11:03:27.931408+00
f762f81d-4f7f-4142-86f0-fb7cb4224dd2	Nagpur	8920	6420	1820	680	18500.00	92.37	2026-08-27 11:03:27.931408+00
bdd04bca-6f32-4a84-8c7a-71d466c93142	Chhatrapati Sambhajinagar	6480	4660	1250	570	17800.00	91.20	2026-08-27 11:03:27.931408+00
9ce2afb5-30c9-49d8-9af5-a8e3b70cdd9d	Nashik	7340	5210	1490	640	19200.00	91.28	2026-08-27 11:03:27.931408+00
e749b477-286a-4427-9f08-da67690af8e5	Thane	11200	8400	1900	900	23500.00	91.96	2026-08-27 11:03:27.931408+00
\.


--
-- Data for Name: employers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employers (id, company_name, industry, contact_email, contact_phone, district, state, is_verified, website, created_at) FROM stdin;
5cc33a58-4232-4f41-aa0b-16fcf9fbf339	Tata Motors EV Component Division	Automotive & EV	careers.ev@tatamotors.com	+91 20 6658 2000	Pune	Maharashtra	t	https://www.tatamotors.com	2026-08-27 10:59:20.537194+00
cf61c55c-4866-4776-a85e-7bbc6a9d6730	Mahindra Solarize Ltd	Green Energy & Solar	hr@mahindrasolarize.com	+91 22 2490 1441	Mumbai	Maharashtra	t	https://www.mahindrasolarize.com	2026-08-27 10:59:20.537194+00
0164f46b-fc55-4ecd-8d59-c96a55909dd0	Godrej Consumer Products Ltd	Apparel & Packaging	recruitment@godrejcp.com	+91 22 6796 5656	Nashik	Maharashtra	t	https://www.godrejcp.com	2026-08-27 10:59:20.537194+00
9e0b69ca-c0e3-4615-ad22-f654b9501c8c	Bajaj Auto Industrial Trainee Cell	Manufacturing & CNC	apprentice@bajajauto.co.in	+91 20 2747 2851	Chhatrapati Sambhajinagar	Maharashtra	t	https://www.bajajauto.com	2026-08-27 10:59:20.537194+00
12f72821-0e81-4c55-9cae-bd1878052b3a	Finolex Cables Electrical Systems	Electrical & Hardware	talent@finolex.com	+91 20 2747 5963	Pune	Maharashtra	t	https://www.finolex.com	2026-08-27 10:59:20.537194+00
\.


--
-- Data for Name: enterprise_ledger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enterprise_ledger (id, trainee_id, entry_month, revenue_amount, expense_amount, net_profit, notes, created_at) FROM stdin;
\.


--
-- Data for Name: government_schemes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.government_schemes (id, name, nodal_agency, subsidy_pct, max_grant_amount, target_trades, allocated_budget, disbursed_budget, beneficiaries_count, is_active, created_at) FROM stdin;
240d3ab1-eaea-4df9-80de-825c81df5f5a	PMEGP - Prime Minister Employment Generation Programme	Khadi and Village Industries Commission (KVIC)	35.00	500000.00	{"Tailoring & Garments","Solar & Electrical",Agri-Tech}	100000000.00	38500000.00	420	t	2026-08-26 19:26:17.995272+00
a99ba186-45e8-4d45-b7f3-51487ee05a16	Pradhan Mantri Mudra Yojana (Shishu & Tarun)	National Credit Guarantee Trustee Company (NCGTC)	20.00	1000000.00	{Micro-Enterprise,"Automotive Repair","Food Processing"}	85000000.00	24100000.00	310	t	2026-08-26 19:26:17.995272+00
1423c024-d42a-4e31-a22e-a7cff2a5f0ad	Mahaswayam State Entrepreneurship Grant	MSSDS Maharashtra	50.00	250000.00	{"Women Artisans",Handicrafts,"Boutique Stitching"}	40000000.00	19200000.00	185	t	2026-08-26 19:26:17.995272+00
d60e90bf-50ae-4b76-8ce2-ccf87f5ae279	Prime Minister Employment Generation Programme (PMEGP)	Ministry of MSME	35.00	500000.00	{Tailoring,Solar,"EV Repair"}	50000000.00	14250000.00	142	t	2026-08-27 10:28:32.231196+00
507aae92-77d8-4282-a979-3fb5e9bcd524	Pradhan Mantri MUDRA Yojana (Shishu & Kishore)	Ministry of Finance	15.00	500000.00	{"Micro Enterprise",Retail,Crafts}	35000000.00	8900000.00	89	t	2026-08-27 10:28:32.231196+00
78f23ee7-86b9-4069-9f54-5cb9ae7e5d48	Chief Minister Employment Generation Programme (CMEGP)	State Industries Department	30.00	1000000.00	{Manufacturing,Services,Agri-Business}	75000000.00	22000000.00	210	t	2026-08-27 10:28:32.231196+00
\.


--
-- Data for Name: job_postings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_postings (id, employer_id, title, trade_category, min_salary, max_salary, location_district, openings_count, type, status, created_at) FROM stdin;
dd958dc9-cfad-459b-ad6d-2d816c02b07c	5cc33a58-4232-4f41-aa0b-16fcf9fbf339	EV Battery Assembly Technician	Automotive	18000.00	26000.00	Pune	8	full_time	active	2026-08-27 10:59:20.538785+00
6e8172f4-dce9-42ce-bf1d-3fb78ad69b86	cf61c55c-4866-4776-a85e-7bbc6a9d6730	Rooftop Solar PV Installation Lead	Green Energy	20000.00	30000.00	Nashik	5	full_time	active	2026-08-27 10:59:20.538785+00
06a1eeec-eef3-47cc-ac1d-5de321bca9f5	0164f46b-fc55-4ecd-8d59-c96a55909dd0	Industrial Lockstitch & Pattern Maker	Apparel	16000.00	22000.00	Mumbai	12	full_time	active	2026-08-27 10:59:20.538785+00
812f2c8c-a923-415c-a366-73f3115d425f	9e0b69ca-c0e3-4615-ad22-f654b9501c8c	CNC VMC Machine Operator Apprentice (NAPS)	Manufacturing	14500.00	19000.00	Chhatrapati Sambhajinagar	15	apprenticeship	active	2026-08-27 10:59:20.538785+00
fb2231ee-31e1-4af8-8b00-d862558f7b2b	5cc33a58-4232-4f41-aa0b-16fcf9fbf339	EV Battery Assembly Technician	Automotive	18000.00	26000.00	Pune	8	full_time	active	2026-08-27 11:03:33.31612+00
300cae0d-fc87-475b-b458-c5339611d833	cf61c55c-4866-4776-a85e-7bbc6a9d6730	Rooftop Solar PV Installation Lead	Green Energy	20000.00	30000.00	Nashik	5	full_time	active	2026-08-27 11:03:33.31612+00
15795439-1eb4-47ef-9152-987a1291ed4e	0164f46b-fc55-4ecd-8d59-c96a55909dd0	Industrial Lockstitch & Pattern Maker	Apparel	16000.00	22000.00	Mumbai	12	full_time	active	2026-08-27 11:03:33.31612+00
3b5edd90-d6ca-49f1-b6f3-b42eb7f5aa1e	9e0b69ca-c0e3-4615-ad22-f654b9501c8c	CNC VMC Machine Operator Apprentice (NAPS)	Manufacturing	14500.00	19000.00	Chhatrapati Sambhajinagar	15	apprenticeship	active	2026-08-27 11:03:33.31612+00
\.


--
-- Data for Name: platform_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_feedback (id, user_id, user_email, user_name, category, title, description, rating, status, created_at) FROM stdin;
\.


--
-- Data for Name: privacy_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.privacy_requests (id, trainee_id, request_type, status, details, created_at, processed_at) FROM stdin;
\.


--
-- Data for Name: promo_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promo_codes (id, code, discount_type, discount_val, max_uses, current_uses, district, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: recommended_opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommended_opportunities (id, title, category, provider, link_url, description, target_skills, is_active, created_at) FROM stdin;
a30ed36f-66f8-4c91-ad5f-cd13ee157d21	Prime Minister Employment Generation Programme (PMEGP)	Government Scheme	Ministry of MSME	https://www.kviconline.gov.in/pmegpeportal/	Credit-linked subsidy programme for setting up new micro-enterprises with up to 35% government subsidy.	{Entrepreneurship,Tailoring,Manufacturing}	t	2026-08-26 18:51:42.979878+00
0d3992ea-fa09-417d-9b05-aaacac7eecd7	Mudra Loan Yojana for Micro-Enterprises	Financial Aid	Government of India	https://www.mudra.org.in/	Collateral-free business loans up to ₹10 Lakhs under Shishu, Kishore, and Tarun categories.	{Self-Employment,"Business Growth"}	t	2026-08-26 18:51:42.979878+00
f3965cda-9900-40ce-91ca-6ca280edd984	Advanced Digital Marketing & E-Commerce Onboarding	Upskilling Course	Skill India Digital Hub	https://www.skillindiadigital.gov.in/	Master social media selling, ONDC integration, and digital payments for your enterprise.	{"Digital Marketing",E-Commerce}	t	2026-08-26 18:51:42.979878+00
1b0e39b5-5a36-41f9-8916-20ae5fba7ebe	Prime Minister Employment Generation Programme (PMEGP)	Government Scheme	Ministry of MSME	https://www.kviconline.gov.in/pmegpeportal/	Credit-linked subsidy programme for setting up new micro-enterprises with up to 35% government subsidy.	{Entrepreneurship,Tailoring,Manufacturing}	t	2026-08-26 19:26:17.960566+00
06bc834b-e5bf-4e5e-9f20-7614703ade6c	Mudra Loan Yojana for Micro-Enterprises	Financial Aid	Government of India	https://www.mudra.org.in/	Collateral-free business loans up to ₹10 Lakhs under Shishu, Kishore, and Tarun categories.	{Self-Employment,"Business Growth"}	t	2026-08-26 19:26:17.960566+00
f8d9fd0c-62ce-4094-9639-d881cdf7d6eb	Advanced Digital Marketing & E-Commerce Onboarding	Upskilling Course	Skill India Digital Hub	https://www.skillindiadigital.gov.in/	Master social media selling, ONDC integration, and digital payments for your enterprise.	{"Digital Marketing",E-Commerce}	t	2026-08-26 19:26:17.960566+00
be345147-c644-4c7b-a671-16fd685c4463	PMEGP 35% Capital Grant for Boutique Setup	State Subsidy Grant	KVIC / Ministry of MSME	https://kviconline.gov.in/pmegp	Direct 35% non-refundable capital subsidy on tailoring equipment and studio setup.	{Tailoring,"Pattern Drafting","Boutique Management"}	t	2026-08-27 10:28:32.234855+00
803ccf89-568e-4dcb-9e8a-a8903608f372	Mudra Kishore Loan - Working Capital	Collateral-Free Loan	Bank of Maharashtra	https://www.mudra.org.in	Institutional working capital credit for fabric inventory expansion at concessional 7.5% p.a. interest rate.	{Self-Employment,"MSME Invoicing"}	t	2026-08-27 10:28:32.234855+00
45deb503-84e7-4912-9022-27c0bd8f7458	Advanced Sustainable Fashion & Export Upskilling	Advanced Upskilling	Nexus Center of Excellence	/dashboard	Specialized 4-week workshop on global organic fabrics, digital drafting, and export compliance.	{"Garment Export","CAD Design"}	t	2026-08-27 10:28:32.234855+00
9058eecc-0dfc-44ac-b58a-d7796a9301fa	PMEGP 35% Capital Grant for Boutique Setup	State Subsidy Grant	KVIC / Ministry of MSME	https://kviconline.gov.in/pmegp	Direct 35% non-refundable capital subsidy on tailoring equipment and studio setup.	{Tailoring,"Pattern Drafting","Boutique Management"}	t	2026-08-27 10:32:50.299954+00
3cf28257-6a44-4b53-98cd-aeea0ccba843	Mudra Kishore Loan - Working Capital	Collateral-Free Loan	Bank of Maharashtra	https://www.mudra.org.in	Institutional working capital credit for fabric inventory expansion at concessional 7.5% p.a. interest rate.	{Self-Employment,"MSME Invoicing"}	t	2026-08-27 10:32:50.299954+00
f480d31c-0db1-4800-bcad-112e01952e05	Advanced Sustainable Fashion & Export Upskilling	Advanced Upskilling	Nexus Center of Excellence	/dashboard	Specialized 4-week workshop on global organic fabrics, digital drafting, and export compliance.	{"Garment Export","CAD Design"}	t	2026-08-27 10:32:50.299954+00
32bf9116-82d8-4360-9c6f-0f6de3f81d60	PMEGP 35% Capital Grant for Boutique Setup	State Subsidy Grant	KVIC / Ministry of MSME	https://kviconline.gov.in/pmegp	Direct 35% non-refundable capital subsidy on tailoring equipment and studio setup.	{Tailoring,"Pattern Drafting","Boutique Management"}	t	2026-08-27 11:03:27.931408+00
bd0cb042-e525-418e-9e1e-a4e48f932390	Mudra Kishore Loan - Working Capital	Collateral-Free Loan	Bank of Maharashtra	https://www.mudra.org.in	Institutional working capital credit for fabric inventory expansion at concessional 7.5% p.a. interest rate.	{Self-Employment,"MSME Invoicing"}	t	2026-08-27 11:03:27.931408+00
90e684b9-f1e8-4fb4-924c-c8cb83bfedb7	Advanced Sustainable Fashion & Export Upskilling	Advanced Upskilling	Nexus Center of Excellence	/dashboard	Specialized 4-week workshop on global organic fabrics, digital drafting, and export compliance.	{"Garment Export","CAD Design"}	t	2026-08-27 11:03:27.931408+00
\.


--
-- Data for Name: scheme_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scheme_applications (id, application_no, trainee_id, scheme_id, business_name, requested_amount, sanctioned_amount, status, bank_account_no, ifsc_code, remarks, applied_at, updated_at) FROM stdin;
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, trainee_id, trainee_name, trainee_email, category, subject, message, status, assigned_to, admin_response, created_at, updated_at) FROM stdin;
f43daf70-15f6-4f9e-90df-3020050cf2b9	8db21243-0294-4d8f-b6fd-a77ee675de65	Priya Sharma	priya.sharma@mahaskill.in	Certificate Verification			in_progress	District Officer Pune		2026-08-27 10:42:45.32582+00	2026-08-27 15:32:57.19+00
\.


--
-- Data for Name: survey_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.survey_templates (id, milestone, title, description, questions, created_at) FROM stdin;
5302b8d5-c150-4c2d-9557-d54ea5cc1e92	3_months	3-Month Post-Certification Survey (M+3)	Initial transition and wage baseline check-in.	[{"id": "q1", "text": "What is your current employment or enterprise status?", "type": "select", "options": ["Employed (Wage / Salary)", "Self-Employed / Own Enterprise", "Seeking Employment", "Pursuing Higher Education"]}, {"id": "q2", "max": 200000, "min": 0, "text": "What is your current monthly income / business revenue?", "type": "number"}, {"id": "q3", "text": "Are you utilizing the skills learned during your training course?", "type": "select", "options": ["Yes, Directly in Daily Work", "Partially", "No, Different Field"]}]	2026-08-27 10:59:20.535318+00
d3485446-9843-4486-95d0-973cade70c95	6_months	6-Month Career Retention Survey (M+6)	Mid-term wage growth and workplace retention verification.	[{"id": "q1", "text": "Are you still with the same employer / operating the same business?", "type": "select", "options": ["Yes, Same Job / Business", "Switched to Higher-Paying Role", "Shifted Trade", "Currently Unemployed"]}, {"id": "q2", "max": 500000, "min": 0, "text": "Current monthly take-home salary or net enterprise profit:", "type": "number"}, {"id": "q3", "text": "Have you received any wage increments or promotions in the last 6 months?", "type": "select", "options": ["Yes, Increment Received", "Promoted with Higher Wage", "No Change", "Decreased"]}]	2026-08-27 10:59:20.535318+00
aec0153b-425b-4f3c-af86-e12866a68596	12_months	12-Month Annual Impact Survey (M+12)	One-year longitudinal trajectory and financial independence audit.	[{"id": "q1", "text": "Current professional occupation status:", "type": "select", "options": ["Full-time Salaried", "Registered MSME Entrepreneur", "Freelancer / Gig Worker", "Career Break"]}, {"id": "q2", "text": "Current monthly earning range:", "type": "select", "options": ["Below ???15,000", "???15,000 - ???25,000", "???25,000 - ???40,000", "Above ???40,000"]}, {"id": "q3", "text": "How has your certification impacted your overall household income?", "type": "select", "options": ["Significantly Increased (>50%)", "Moderately Increased (20-50%)", "Slight Increase", "No Impact"]}]	2026-08-27 10:59:20.535318+00
\.


--
-- Data for Name: top_skill_gaps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.top_skill_gaps (id, skill_name, demand_count, supply_count, gap_percentage, priority_level, created_at) FROM stdin;
a1a4a693-2b26-4820-8eff-861759edbb3c	EV Battery Diagnostics & Repair	1420	310	78.17	Critical	2026-08-26 18:51:42.979878+00
5794b297-e654-4213-865a-762d79e960a8	Solar Inverter & Micro-Grid Automation	1890	620	67.20	High	2026-08-26 18:51:42.979878+00
ef9a3a97-bd44-42d4-89c9-2326c7ad2755	Boutique Pattern Making & Quality Control	2150	940	56.28	Medium	2026-08-26 18:51:42.979878+00
b4c59023-0633-4c5a-ace7-6e492f74f939	Cloud Backend Engineering & Security	3200	1100	65.63	High	2026-08-26 18:51:42.979878+00
ac718c9b-9400-42a6-be0e-9e962e7afe8b	EV Battery Diagnostics & Repair	1420	310	78.17	Critical	2026-08-26 19:26:17.958255+00
e07e0dea-624b-4267-8fa8-f5a74c3558e5	Solar Inverter & Micro-Grid Automation	1890	620	67.20	High	2026-08-26 19:26:17.958255+00
80ccac38-bb68-4ddd-b6b7-a8d56b490728	Boutique Pattern Making & Quality Control	2150	940	56.28	Medium	2026-08-26 19:26:17.958255+00
9ba54ebf-cf8c-40e8-b6b5-c6736aba8634	Cloud Backend Engineering & Security	3200	1100	65.63	High	2026-08-26 19:26:17.958255+00
a6dfda70-8550-400f-8357-271aed3bd348	Solar PV System Installation	4800	1200	75.00	High	2026-08-27 10:28:32.233684+00
5e7fce65-3d3c-4468-802a-50f250b4e771	EV Battery Diagnostics & BMS	6200	1100	82.25	Critical	2026-08-27 10:28:32.233684+00
1d87a49a-e6f4-4893-9c2f-ab5726e988e5	Industrial Lockstitch & Boutique Design	3500	1400	60.00	High	2026-08-27 10:28:32.233684+00
a279d91b-eeaa-4f92-9991-8d877a2ac939	Full Stack TypeScript & Cloud APIs	8400	2100	75.00	Critical	2026-08-27 10:28:32.233684+00
eb2df6d8-a5ed-495d-9e85-1b14e9c77fe0	Solar PV System Installation	4800	1200	75.00	High	2026-08-27 10:32:50.299954+00
37664642-8729-4fff-900d-b657d93adf31	EV Battery Diagnostics & BMS	6200	1100	82.25	Critical	2026-08-27 10:32:50.299954+00
a85ed70b-10bb-47d0-9eca-9b8ff6abfed9	Industrial Lockstitch & Boutique Design	3500	1400	60.00	High	2026-08-27 10:32:50.299954+00
818be33b-6306-44f6-9d57-ef57113aaeeb	Full Stack TypeScript & Cloud APIs	8400	2100	75.00	Critical	2026-08-27 10:32:50.299954+00
3336a37d-2665-403d-a3f5-d652285bf287	Solar PV System Installation	4800	1200	75.00	High	2026-08-27 11:03:27.931408+00
b5f733d3-98fa-46fc-a47e-c2c8003f9de2	EV Battery Diagnostics & BMS	6200	1100	82.25	Critical	2026-08-27 11:03:27.931408+00
5dd6b576-fda6-43c3-916b-df2c70f11387	Industrial Lockstitch & Boutique Design	3500	1400	60.00	High	2026-08-27 11:03:27.931408+00
cba5127a-f282-45e4-bfe0-8c9ded8a4840	Full Stack TypeScript & Cloud APIs	8400	2100	75.00	Critical	2026-08-27 11:03:27.931408+00
\.


--
-- Data for Name: trainee_employment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_employment (id, trainee_id, status, company_name, designation, joining_date, monthly_salary, offer_letter_url, business_name, business_type, business_category, business_status, establishment_date, monthly_revenue, monthly_profit, udyam_number, gst_number, business_address, employees_count, verified_by_admin, verified_at, created_at, updated_at) FROM stdin;
49b100b8-0930-40ca-b80f-159dbd933a9e	8db21243-0294-4d8f-b6fd-a77ee675de65	self_employed	\N	\N	\N	0.00	\N	Priya Designer Boutique	Micro Enterprise	Apparel & Fashion	active	2023-08-15	45000.00	18500.00	UDYAM-MH-26-0048291	27ABCDE1234F1Z5	Shop 12, FC Road, Pune	4	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
d7b550cb-ca62-4fdc-a47e-80a345c396b8	212e0f6a-9233-406d-9975-05161a14e6ff	employed	Mahagenco Green Energy Solutions	Lead Solar Technician	2023-06-01	28500.00	\N	\N	\N	\N	active	\N	0.00	0.00	\N	\N	\N	0	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
444b91d8-ab1d-4215-aff3-4c8191d6697e	2823e93f-cbe9-4368-98bf-04977bc8f3c0	self_employed	\N	\N	\N	0.00	\N	Patil Cloud Consulting	Sole Proprietorship	IT & Digital Services	active	2023-09-01	65000.00	42000.00	UDYAM-MH-15-0063910	\N	\N	2	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
8e43e8f1-7e6a-49f5-b098-725b58f97049	ba1727b9-703c-45ed-adaf-b563ffe2ab80	self_employed	\N	\N	\N	0.00	\N	Gaikwad EV Service Center	Partnership	Automotive Services	active	2024-01-15	38000.00	16000.00	\N	\N	\N	2	f	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
d2ea84f4-70af-4e08-a1fb-c45396a6a2e2	4c5716ac-0820-44b3-a773-834cee89f9e7	self_employed	\N	\N	\N	0.00	\N	Thane Stitchworks	Private Limited	Textiles & Garments	active	2023-04-10	92000.00	31000.00	UDYAM-MH-33-0074192	\N	\N	6	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
\.


--
-- Data for Name: trainee_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_enrollments (id, trainee_id, program_id, enrolled_date, completed_date, certified_date, certificate_id, status, grade, created_at) FROM stdin;
58b488d7-0535-46d7-b02e-f00a535bae6e	8db21243-0294-4d8f-b6fd-a77ee675de65	c6a0d3e0-d319-469c-8878-eaef0463de26	2023-01-10	2023-04-10	2023-04-15	MS-CERT-904302	certified	A+	2026-08-26 19:35:41.137214+00
0abb549c-ece2-4852-a4b7-11c63d102a59	212e0f6a-9233-406d-9975-05161a14e6ff	71496e5c-0ab2-4010-93a4-425c550630e9	2023-02-01	2023-05-30	2023-06-05	MS-CERT-834141	certified	A	2026-08-26 19:35:41.137214+00
2239938d-7a30-47d1-8908-2bc3c85311c3	3569a752-3a34-483d-b300-f8593bf6fc9f	d74eaf3a-0de9-4318-b98d-cbc905ec809a	2026-08-27	\N	\N	MS-CERT-851613	enrolled	A	2026-08-27 05:03:26.945992+00
63cc816b-2724-4f11-9031-609ab97634a1	3569a752-3a34-483d-b300-f8593bf6fc9f	16c49625-e5c0-4c39-81fe-7611da118ee1	2026-08-27	\N	\N	MS-CERT-860401	enrolled	A	2026-08-27 12:39:04.362561+00
\.


--
-- Data for Name: trainee_followups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_followups (id, trainee_id, milestone, due_date, completed_date, status, current_status, current_income_range, income_growth_pct, job_satisfaction_score, skill_utilization_score, additional_support_needed, survey_channel, survey_data_json, created_at, updated_at) FROM stdin;
e471bbe1-2aa0-4c91-9a3d-db3602fc1a75	8db21243-0294-4d8f-b6fd-a77ee675de65	3_months	2023-11-15	2023-11-14	completed	self_employed	₹15,000 – ₹25,000	15.50	5	5	Need guidance on GST invoice generation	web_portal	{"client_count": 18, "monthly_turnover": 35000}	2026-08-27 04:15:32.817349+00	2026-08-27 04:15:32.817349+00
fd90f2d6-046b-457e-9808-fa3e18c5cc1d	8db21243-0294-4d8f-b6fd-a77ee675de65	6_months	2024-02-15	2024-02-14	completed	self_employed	₹20,000 – ₹35,000	28.00	5	5	Applied for Mudra loan for 2 new sewing machines	web_portal	{"client_count": 26, "monthly_turnover": 42000}	2026-08-27 04:15:32.817349+00	2026-08-27 04:15:32.817349+00
4484a038-d246-4562-bdcc-be4958450b0b	8db21243-0294-4d8f-b6fd-a77ee675de65	12_months	2024-08-15	2024-08-12	completed	self_employed	₹25,000 – ₹45,000	45.00	5	5	Hired 2 apprentices from MSSDS training center	web_portal	{"employees": 2, "monthly_turnover": 65000}	2026-08-27 04:15:32.817349+00	2026-08-27 04:15:32.817349+00
6cf8a675-9478-4685-9c99-062c0f2b25da	8db21243-0294-4d8f-b6fd-a77ee675de65	18_months	2025-02-15	2025-02-10	completed	self_employed	₹35,000 – ₹60,000	60.00	5	5	Expanded into bridal wear and boutique tailoring	web_portal	{"employees": 3, "monthly_turnover": 85000}	2026-08-27 04:15:32.817349+00	2026-08-27 04:15:32.817349+00
c0ae89f1-1743-4f25-9bd9-584a58dd53da	8db21243-0294-4d8f-b6fd-a77ee675de65	24_months	2025-08-15	\N	upcoming	self_employed	₹45,000 – ₹75,000	75.00	5	5	Planning second outlet in Kothrud, Pune	web_portal	{"target_turnover": 120000}	2026-08-27 04:15:32.817349+00	2026-08-27 04:15:32.817349+00
\.


--
-- Data for Name: trainee_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_notifications (id, trainee_id, title, message, type, is_read, created_at) FROM stdin;
806018f8-308d-4b60-aac6-6c0675fce26c	8db21243-0294-4d8f-b6fd-a77ee675de65	Longitudinal Survey M+18 Verified	District Officer has verified your 18-month micro-enterprise progression report. Income tier upgraded.	success	f	2026-08-25 04:15:32.819947+00
4e02a172-6def-49fe-9959-f7a5af63ed98	8db21243-0294-4d8f-b6fd-a77ee675de65	PMEGP Subsidy Recommendation	Based on your active Udyam registration (UDYAM-MH-26-0048291), you are pre-qualified for 35% PMEGP subsidy.	info	f	2026-08-22 04:15:32.819947+00
b158a340-c1d4-4a46-8407-efa285607a0d	8db21243-0294-4d8f-b6fd-a77ee675de65	Certificate Cryptographically Validated	Your NSQF Level 5 Certificate (MS-CERT-904302) is verified and linked to your longitudinal QR code.	info	t	2026-08-15 04:15:32.819947+00
eba12f9b-d72b-4466-9dd3-921eefd15e20	\N			info	f	2026-08-27 10:43:05.62817+00
\.


--
-- Data for Name: trainees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainees (id, user_id, trainee_id, username, full_name, email, phone, dob, gender, aadhaar_masked, address, district, state, pincode, avatar_url, profile_completion_pct, is_active, highest_education, board_university, year_of_passing, education_percentage, skills, about_me, privacy_hash, created_at, updated_at, notification_preferences) FROM stdin;
212e0f6a-9233-406d-9975-05161a14e6ff	\N	TRN-519284	rahul_solar	Rahul Deshmukh	rahul.deshmukh@mahaskill.in	+91 97654 32109	2001-09-20	Male	XXXX-XXXX-0000	Plot 18, Wardha Road	Nagpur	Maharashtra			85	t	ITI Electrical	MSBTE Maharashtra	2021	79.20	{"Solar Rooftop PV","Inverter Diagnostics","High-Voltage Safety","Grid Sync"}	Grid solar installation specialist certified under NISE with experience in commercial rooftop installations across Vidarbha.	6bf9d298c8bc4591853f55e934d6814de9b7878508107265d8faca25bedb08c8	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00	{"browser": true, "surveys": true, "telegram": false}
2823e93f-cbe9-4368-98bf-04977bc8f3c0	\N	TRN-639102	snehal_tech	Snehal Patil	snehal.patil@mahaskill.in	+91 94230 87654	2000-11-08	Female	XXXX-XXXX-0000	College Road, Nashik	Nashik	Maharashtra			95	t	B.Sc Computer Science	Savitribai Phule Pune University	2022	84.50	{"Full-Stack Development",PostgreSQL,"Cloud Infrastructure","REST APIs"}	Building next-generation digital tools and agri-commerce solutions for farmers and rural self-help groups in North Maharashtra.	e2a75c8104faaa783d47eb425cd1edb68b270b19ca157d0190e4a7c2474b264c	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00	{"browser": true, "surveys": true, "telegram": false}
ba1727b9-703c-45ed-adaf-b563ffe2ab80	\N	TRN-392817	amit_ev	Amit Gaikwad	amit.gaikwad@mahaskill.in	+91 98901 23456	2003-02-28	Male	XXXX-XXXX-0000	CIDCO N-4	Aurangabad (Chhatrapati Sambhajinagar)	Maharashtra			80	t	10th Standard + ITI Mechanic	Maharashtra Vocational Board	2022	76.80	{"EV Powertrain","Lithium Battery Repair","BMS Calibration","Motor Controllers"}	Certified EV service technician operating independent two-wheeler EV repair hub funded under PM Mudra Shishu grant.	776954c530620154bc6bb25040e8177d2934515acb0608207a7efca6aeb13d59	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00	{"browser": true, "surveys": true, "telegram": false}
4c5716ac-0820-44b3-a773-834cee89f9e7	\N	TRN-741920	kavita_thane	Kavita Jadhav	kavita.jadhav@mahaskill.in	+91 98190 65432	1999-07-19	Female	XXXX-XXXX-0000	Ghodbunder Road	Thane	Maharashtra			90	t	Diploma in Textile Technology	Government Polytechnic Thane	2020	88.30	{"Textile Quality Testing","Industrial Sewing",Merchandising,"Export Standards"}	Textile quality supervisor and owner of Thane Stitchworks, exporting eco-friendly fabric bags and apparel.	be929bc6dcaa5363ccb0693580b746498ddef3c805f4a805837b1c9d2200d91a	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00	{"browser": true, "surveys": true, "telegram": false}
54accd10-6c84-4931-a1e8-c2c6386bfc3f	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	TRN-575336	superadmin	Super Administrator	admin@nexus.com		2000-01-01	Not Specified	XXXX-XXXX-0000			Maharashtra			30	t			2022	0.00	{}		1f61b59ab46958cb2321128213262215b383e18b072ffca567db882141feae46	2026-08-26 19:49:30.175888+00	2026-08-26 19:49:30.175888+00	{"browser": true, "surveys": true, "telegram": false}
3ea2b863-e3c5-41ad-a503-c99ba7404c75	9672eb6f-31b7-40aa-b30f-fad91006dadf	TRN-104861	wajeshravani1	wajeshravani1	wajeshravani1@gmail.com		2000-01-01	Prefer not to say			Maharashtra	Maharashtra			30	t			2022	0.00	{}		ea1f6578cac92384428500d3ed0bdbb4ed0e7976649f2ea76f8c8dc9b59af99e	2026-08-27 12:26:58.409805+00	2026-08-27 12:26:58.409805+00	{"browser": true, "surveys": true, "telegram": false}
8db21243-0294-4d8f-b6fd-a77ee675de65	8db21243-0294-4d8f-b6fd-a77ee675de65	TRN-847291	priya_sharma	Priya Sharma	priya.sharma@mahaskill.in	+91 98231 45678	2002-05-14	Female	XXXX-XXXX-0000	Flat 402, Shivajinagar	Pune	Maharashtra			90	t	12th Standard (Arts)	Maharashtra State Board	2020	81.40	{"Boutique Tailoring","Pattern Design","Digital Payments","ONDC Selling"}	Certified garment specialist and founder of Priya Designer Boutique. Empowering 4 local artisans through custom apparel manufacturing.	9bf2830fbde5525d6976c3c3fcb8cebe37352b925b45350223d2818807bcbaba	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00	{"browser": true, "surveys": true, "telegram": false}
3569a752-3a34-483d-b300-f8593bf6fc9f	6d1e454b-d7d1-41d3-a9f3-198e3a687b3e	TRN-191836	avishkarkedar	avishkarkedar	avishkarkedar@gmail.com		2000-01-01	Prefer not to say	XXXX-XXXX-XXXX		Maharashtra	Maharashtra			30	t	Secondary / Higher Secondary		2023	89.00	{Java,Python}	Avishkar Kedar , PCCOER 	22524ab06816d114fd7238e4fa804f79858f68a49d8b4c198d8e31c5c1accc64	2026-08-27 05:00:18.502791+00	2026-08-27 05:03:21.285+00	{"browser": true, "surveys": true, "telegram": false}
7c16d16b-ec4d-41c5-a240-4b7a05707eab	f9c7185f-8011-41aa-bdab-0851f6cecbc8	TRN-191104	aryakulkarni999	aryakulkarni999	aryakulkarni999@gmail.com		2000-01-01	Prefer not to say			Maharashtra	Maharashtra			30	t			2022	0.00	{}		cdfdb7284fb9270a7c47c6fbd5fbcda2ac591175e57ddede912d9ba7b36a79bc	2026-08-27 05:23:33.796625+00	2026-08-27 05:23:33.796625+00	{"browser": true, "surveys": true, "telegram": false}
cc3b1730-9f55-4d31-b203-f74f883e7d17	023cecaa-f5ef-4ef3-9f8e-67bcaa9b5af7	TRN-962647	dbharati5162	dbharati5162	dbharati5162@gmail.com		2000-01-01	Prefer not to say			Maharashtra	Maharashtra			30	t			2022	0.00	{}		eb5abae245595aa2bc9501fd184d1be08b73461f466c6ba594a047c8a50c0e61	2026-08-27 12:06:06.704747+00	2026-08-27 12:06:06.704747+00	{"browser": true, "surveys": true, "telegram": false}
\.


--
-- Data for Name: training_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.training_programs (id, title, sector, duration_months, provider_name, description, created_at) FROM stdin;
c6a0d3e0-d319-469c-8878-eaef0463de26	Advanced Tailoring & Garment Manufacturing	Apparel & Fashion	3	Maharashtra State Skill Development Society (MSSDS)	Comprehensive industrial stitching, pattern design, and boutique entrepreneurship.	2026-08-26 19:26:17.956644+00
71496e5c-0ab2-4010-93a4-425c550630e9	Solar PV Rooftop Technician	Renewable Energy	4	National Institute of Solar Energy (NISE)	Grid-connected solar system design, inverter configuration, and safety compliance.	2026-08-26 19:26:17.956644+00
db9398c1-15dd-44f9-997c-ad53e623fc3d	Full-Stack Web Development & Cloud Deployment	IT & ITeS	6	National Skill Development Corporation (NSDC)	Modern enterprise web architecture, database design, and cloud scalability.	2026-08-26 19:26:17.956644+00
d74eaf3a-0de9-4318-b98d-cbc905ec809a	Automotive Electric Vehicle (EV) Maintenance	Automotive	4	Automotive Skills Development Council (ASDC)	EV battery diagnostics, motor controllers, and regenerative braking repair.	2026-08-26 19:26:17.956644+00
f36a3e38-c122-4597-a674-1c1eab6c2629	Self-Employed Tailor & Boutique Specialist	Apparel, Made-Ups & Home Furnishing	3	Nexus Vocational Institute Pune	NSQF Level 4 training in pattern drafting, single-needle lockstitch, boutique operations, and digital invoicing.	2026-08-27 10:28:32.229824+00
d6b2e2e6-cff7-4071-91d2-883cf8e8717a	Solar PV Installer & Grid Technician	Green Jobs & Renewable Energy	4	Nexus Clean Energy Skill Center	NSQF Level 4 installation, DC stringing, grid-tie inverter synchronization, and safety compliance.	2026-08-27 10:28:32.229824+00
c2912b36-bdd4-4413-af4e-d043e46abfe0	Electric Vehicle Service & Battery Technician	Automotive & EV Technology	4	Nexus Advanced Mobility Hub	NSQF Level 5 EV powertrain diagnosis, high-voltage battery pack testing, and CAN bus troubleshooting.	2026-08-27 10:28:32.229824+00
16c49625-e5c0-4c39-81fe-7611da118ee1	Full Stack Web & Cloud Applications Developer	IT-ITeS & Software	6	Nexus Digital Academy	NSQF Level 6 modern web development, TypeScript, PostgreSQL, and cloud architecture.	2026-08-27 10:28:32.229824+00
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, email, username, role, created_at) FROM stdin;
1e662b0b-7d53-44a4-bc82-7b3fb6658045	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	admin@nexus.com	superadmin	superadmin	2026-08-26 19:49:30.175888+00
\.


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verifications (id, trainee_id, document_type, document_name, document_url, status, admin_notes, reviewed_by, reviewed_at, created_at) FROM stdin;
309f31c1-2943-48c5-919f-f3b082fc455b	212e0f6a-9233-406d-9975-05161a14e6ff	offer_letter	Offer Letter & Salary Slip - Mahagenco.pdf	https://api.avishkark.in/storage/v1/object/public/docs/offer_sample.pdf	approved	\N	admin@nexus.com	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
8fec74da-c2b1-455d-8435-79fc228163fb	ba1727b9-703c-45ed-adaf-b563ffe2ab80	bank_statement	Mudra Loan Sanction Letter - Bank of Maharashtra.pdf	https://api.avishkark.in/storage/v1/object/public/docs/mudra_sample.pdf	pending	\N	\N	\N	2026-08-26 19:35:41.137214+00
4a06c83a-0521-4e47-a3df-cb0279745534	4c5716ac-0820-44b3-a773-834cee89f9e7	gst	GST Registration Certificate - Thane Stitchworks.pdf	https://api.avishkark.in/storage/v1/object/public/docs/gst_sample.pdf	pending	\N	\N	\N	2026-08-26 19:35:41.137214+00
fbac0d97-d48d-4892-96c4-6c5b8351005a	8db21243-0294-4d8f-b6fd-a77ee675de65	self_employment_proof	Udyam Registration Certificate	https://storage.avishkark.in/docs/udyam_certificate_priya.pdf	verified	Udyam Registration validated with MSME national database.	Executive Superadmin (Avishkar0)	2026-08-17 04:15:56.483416+00	2026-08-27 04:15:56.483416+00
c56a7851-0373-48f5-9857-974b33cb1df0	8db21243-0294-4d8f-b6fd-a77ee675de65	aadhaar	Masked Aadhaar Smart Card	https://storage.avishkark.in/docs/aadhaar_masked_priya.pdf	verified	Zero-PII SHA-256 Aadhaar checksum matched UIDAI standard.	Executive Superadmin (Avishkar0)	2026-07-28 04:15:56.483416+00	2026-08-27 04:15:56.483416+00
19ebbd9a-e7fa-4bc2-b8ab-d7bcf5e6feff	8db21243-0294-4d8f-b6fd-a77ee675de65	income_proof	GST Return 3B Receipt	https://storage.avishkark.in/docs/gst_return_priya.pdf	verified	GST Return 3B for Q3 matched reported revenue.	Executive Superadmin (Avishkar0)	2026-08-22 04:15:56.483416+00	2026-08-27 04:15:56.483416+00
\.


--
-- Data for Name: messages_2026_08_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_08_24 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_25; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_08_25 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_26; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_08_26 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_27; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_08_27 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_28; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_08_28 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: messages_2026_08_29; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_08_29 (topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-08-25 17:01:06
20211116045059	2026-08-25 17:01:06
20211116050929	2026-08-25 17:01:06
20211116051442	2026-08-25 17:01:06
20211116212300	2026-08-25 17:01:06
20211116213355	2026-08-25 17:01:06
20211116213934	2026-08-25 17:01:06
20211116214523	2026-08-25 17:01:06
20211122062447	2026-08-25 17:01:06
20211124070109	2026-08-25 17:01:06
20211202204204	2026-08-25 17:01:06
20211202204605	2026-08-25 17:01:06
20211210212804	2026-08-25 17:01:06
20211228014915	2026-08-25 17:01:06
20220107221237	2026-08-25 17:01:06
20220228202821	2026-08-25 17:01:06
20220312004840	2026-08-25 17:01:06
20220603231003	2026-08-25 17:01:06
20220603232444	2026-08-25 17:01:06
20220615214548	2026-08-25 17:01:06
20220712093339	2026-08-25 17:01:06
20220908172859	2026-08-25 17:01:06
20220916233421	2026-08-25 17:01:06
20230119133233	2026-08-25 17:01:06
20230128025114	2026-08-25 17:01:06
20230128025212	2026-08-25 17:01:06
20230227211149	2026-08-25 17:01:06
20230228184745	2026-08-25 17:01:06
20230308225145	2026-08-25 17:01:06
20230328144023	2026-08-25 17:01:06
20231018144023	2026-08-25 17:01:06
20231204144023	2026-08-25 17:01:06
20231204144024	2026-08-25 17:01:06
20231204144025	2026-08-25 17:01:06
20240108234812	2026-08-25 17:01:06
20240109165339	2026-08-25 17:01:06
20240227174441	2026-08-25 17:01:06
20240311171622	2026-08-25 17:01:06
20240321100241	2026-08-25 17:01:06
20240401105812	2026-08-25 17:01:06
20240418121054	2026-08-25 17:01:06
20240523004032	2026-08-25 17:01:06
20240618124746	2026-08-25 17:01:06
20240801235015	2026-08-25 17:01:06
20240805133720	2026-08-25 17:01:06
20240827160934	2026-08-25 17:01:06
20240919163303	2026-08-25 17:01:06
20240919163305	2026-08-25 17:01:06
20241019105805	2026-08-25 17:01:06
20241030150047	2026-08-25 17:01:06
20241108114728	2026-08-25 17:01:06
20241121104152	2026-08-25 17:01:06
20241130184212	2026-08-25 17:01:06
20241220035512	2026-08-25 17:01:06
20241220123912	2026-08-25 17:01:06
20241224161212	2026-08-25 17:01:06
20250107150512	2026-08-25 17:01:06
20250110162412	2026-08-25 17:01:06
20250123174212	2026-08-25 17:01:06
20250128220012	2026-08-25 17:01:06
20250506224012	2026-08-25 17:01:06
20250523164012	2026-08-25 17:01:06
20250714121412	2026-08-25 17:01:06
20250905041441	2026-08-25 17:01:06
20251103001201	2026-08-25 17:01:06
20251120212548	2026-08-25 17:01:06
20251120215549	2026-08-25 17:01:06
20260218120000	2026-08-25 17:01:06
20260326120000	2026-08-25 17:01:06
20260514120000	2026-08-25 17:01:06
20260527120000	2026-08-25 17:01:06
20260528120000	2026-08-25 17:01:06
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
verifications	verifications	\N	2026-08-26 15:13:54.984899+00	2026-08-26 15:13:54.984899+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.iceberg_namespaces (id, bucket_name, name, created_at, updated_at, metadata, catalog_id) FROM stdin;
\.


--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.iceberg_tables (id, namespace_id, bucket_name, name, location, created_at, updated_at, remote_table_id, shard_key, shard_id, catalog_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-08-25 17:01:07.628869
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-08-25 17:01:07.636197
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-08-25 17:01:07.63875
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-08-25 17:01:07.653093
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-08-25 17:01:07.659308
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-08-25 17:01:07.661657
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-08-25 17:01:07.664559
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-08-25 17:01:07.667886
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-08-25 17:01:07.670117
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-08-25 17:01:07.672816
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-08-25 17:01:07.67705
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-08-25 17:01:07.679456
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-08-25 17:01:07.683018
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-08-25 17:01:07.685595
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-08-25 17:01:07.688009
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-08-25 17:01:07.715375
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-08-25 17:01:07.718593
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-08-25 17:01:07.722181
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-08-25 17:01:07.726349
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-08-25 17:01:07.733018
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-08-25 17:01:07.73683
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-08-25 17:01:07.742242
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-08-25 17:01:07.753923
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-08-25 17:01:07.767652
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-08-25 17:01:07.77762
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-08-25 17:01:07.783018
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-08-25 17:01:07.785819
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-08-25 17:01:07.788456
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-08-25 17:01:07.793663
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-08-25 17:01:07.806281
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-08-25 17:01:07.810161
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-08-25 17:01:07.812099
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-08-25 17:01:07.815609
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-08-25 17:01:07.817745
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-08-25 17:01:07.820095
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-08-25 17:01:07.823819
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-08-25 17:01:07.825912
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-08-25 17:01:07.828006
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-08-25 17:01:07.83112
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-08-25 17:01:07.863655
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-08-25 17:01:07.867628
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-08-25 17:01:07.870936
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-08-25 17:01:07.873083
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-08-25 17:01:07.875198
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-08-25 17:01:07.87768
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-08-25 17:01:07.883288
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-08-25 17:01:07.891841
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-08-25 17:01:07.896054
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-08-25 17:01:07.89924
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-08-25 17:01:07.930777
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-08-25 17:01:07.934674
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-08-25 17:01:07.952801
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-08-25 17:01:07.954112
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-08-25 17:01:07.962297
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-08-25 17:01:07.964526
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-08-25 17:01:07.965898
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-08-25 17:01:07.970286
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-08-25 17:01:07.975131
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-08-25 17:01:07.977613
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-08-25 17:01:07.982105
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-08-25 17:01:07.985408
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2026-08-25 17:00:58.258376+00
20210809183423_update_grants	2026-08-25 17:00:58.258376+00
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 55, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: ai_policy_insights ai_policy_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_policy_insights
    ADD CONSTRAINT ai_policy_insights_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: district_employment_stats district_employment_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district_employment_stats
    ADD CONSTRAINT district_employment_stats_pkey PRIMARY KEY (id);


--
-- Name: employers employers_contact_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employers
    ADD CONSTRAINT employers_contact_email_key UNIQUE (contact_email);


--
-- Name: employers employers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employers
    ADD CONSTRAINT employers_pkey PRIMARY KEY (id);


--
-- Name: enterprise_ledger enterprise_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_ledger
    ADD CONSTRAINT enterprise_ledger_pkey PRIMARY KEY (id);


--
-- Name: government_schemes government_schemes_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.government_schemes
    ADD CONSTRAINT government_schemes_name_key UNIQUE (name);


--
-- Name: government_schemes government_schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.government_schemes
    ADD CONSTRAINT government_schemes_pkey PRIMARY KEY (id);


--
-- Name: job_postings job_postings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_pkey PRIMARY KEY (id);


--
-- Name: platform_feedback platform_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_pkey PRIMARY KEY (id);


--
-- Name: privacy_requests privacy_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privacy_requests
    ADD CONSTRAINT privacy_requests_pkey PRIMARY KEY (id);


--
-- Name: promo_codes promo_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promo_codes
    ADD CONSTRAINT promo_codes_code_key UNIQUE (code);


--
-- Name: promo_codes promo_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promo_codes
    ADD CONSTRAINT promo_codes_pkey PRIMARY KEY (id);


--
-- Name: recommended_opportunities recommended_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommended_opportunities
    ADD CONSTRAINT recommended_opportunities_pkey PRIMARY KEY (id);


--
-- Name: scheme_applications scheme_applications_application_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheme_applications
    ADD CONSTRAINT scheme_applications_application_no_key UNIQUE (application_no);


--
-- Name: scheme_applications scheme_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheme_applications
    ADD CONSTRAINT scheme_applications_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: survey_templates survey_templates_milestone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey_templates
    ADD CONSTRAINT survey_templates_milestone_key UNIQUE (milestone);


--
-- Name: survey_templates survey_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey_templates
    ADD CONSTRAINT survey_templates_pkey PRIMARY KEY (id);


--
-- Name: top_skill_gaps top_skill_gaps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.top_skill_gaps
    ADD CONSTRAINT top_skill_gaps_pkey PRIMARY KEY (id);


--
-- Name: trainee_employment trainee_employment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_employment
    ADD CONSTRAINT trainee_employment_pkey PRIMARY KEY (id);


--
-- Name: trainee_enrollments trainee_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_enrollments
    ADD CONSTRAINT trainee_enrollments_pkey PRIMARY KEY (id);


--
-- Name: trainee_followups trainee_followups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_followups
    ADD CONSTRAINT trainee_followups_pkey PRIMARY KEY (id);


--
-- Name: trainee_notifications trainee_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_notifications
    ADD CONSTRAINT trainee_notifications_pkey PRIMARY KEY (id);


--
-- Name: trainees trainees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_email_key UNIQUE (email);


--
-- Name: trainees trainees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_pkey PRIMARY KEY (id);


--
-- Name: trainees trainees_privacy_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_privacy_hash_key UNIQUE (privacy_hash);


--
-- Name: trainees trainees_trainee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_trainee_id_key UNIQUE (trainee_id);


--
-- Name: trainees trainees_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_username_key UNIQUE (username);


--
-- Name: training_programs training_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_programs
    ADD CONSTRAINT training_programs_pkey PRIMARY KEY (id);


--
-- Name: training_programs training_programs_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_programs
    ADD CONSTRAINT training_programs_title_key UNIQUE (title);


--
-- Name: user_roles user_roles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_email_key UNIQUE (email);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_24 messages_2026_08_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_24
    ADD CONSTRAINT messages_2026_08_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_25 messages_2026_08_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_25
    ADD CONSTRAINT messages_2026_08_25_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_26 messages_2026_08_26_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_26
    ADD CONSTRAINT messages_2026_08_26_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_27 messages_2026_08_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_27
    ADD CONSTRAINT messages_2026_08_27_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_28 messages_2026_08_28_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_28
    ADD CONSTRAINT messages_2026_08_28_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_08_29 messages_2026_08_29_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_08_29
    ADD CONSTRAINT messages_2026_08_29_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: iceberg_namespaces iceberg_namespaces_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_namespaces
    ADD CONSTRAINT iceberg_namespaces_pkey PRIMARY KEY (id);


--
-- Name: iceberg_tables iceberg_tables_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: feature_flags_name_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX feature_flags_name_index ON _realtime.feature_flags USING btree (name);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: idx_job_postings_district; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_postings_district ON public.job_postings USING btree (location_district);


--
-- Name: idx_job_postings_trade; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_postings_trade ON public.job_postings USING btree (trade_category);


--
-- Name: idx_ledger_trainee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ledger_trainee ON public.enterprise_ledger USING btree (trainee_id);


--
-- Name: idx_scheme_apps_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheme_apps_status ON public.scheme_applications USING btree (status);


--
-- Name: idx_scheme_apps_trainee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheme_apps_trainee ON public.scheme_applications USING btree (trainee_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_08_24_inserted_at_topic_idx ON realtime.messages_2026_08_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_25_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_08_25_inserted_at_topic_idx ON realtime.messages_2026_08_25 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_26_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_08_26_inserted_at_topic_idx ON realtime.messages_2026_08_26 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_27_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_08_27_inserted_at_topic_idx ON realtime.messages_2026_08_27 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_28_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_08_28_inserted_at_topic_idx ON realtime.messages_2026_08_28 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_08_29_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_08_29_inserted_at_topic_idx ON realtime.messages_2026_08_29 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_iceberg_namespaces_bucket_id; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_iceberg_namespaces_bucket_id ON storage.iceberg_namespaces USING btree (catalog_id, name);


--
-- Name: idx_iceberg_tables_location; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_iceberg_tables_location ON storage.iceberg_tables USING btree (location);


--
-- Name: idx_iceberg_tables_namespace_id; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_iceberg_tables_namespace_id ON storage.iceberg_tables USING btree (catalog_id, namespace_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2026_08_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_24_inserted_at_topic_idx;


--
-- Name: messages_2026_08_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_24_pkey;


--
-- Name: messages_2026_08_25_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_25_inserted_at_topic_idx;


--
-- Name: messages_2026_08_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_25_pkey;


--
-- Name: messages_2026_08_26_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_26_inserted_at_topic_idx;


--
-- Name: messages_2026_08_26_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_26_pkey;


--
-- Name: messages_2026_08_27_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_27_inserted_at_topic_idx;


--
-- Name: messages_2026_08_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_27_pkey;


--
-- Name: messages_2026_08_28_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_28_inserted_at_topic_idx;


--
-- Name: messages_2026_08_28_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_28_pkey;


--
-- Name: messages_2026_08_29_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_08_29_inserted_at_topic_idx;


--
-- Name: messages_2026_08_29_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_08_29_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: enterprise_ledger enterprise_ledger_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enterprise_ledger
    ADD CONSTRAINT enterprise_ledger_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: job_postings job_postings_employer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employers(id) ON DELETE CASCADE;


--
-- Name: platform_feedback platform_feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: privacy_requests privacy_requests_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privacy_requests
    ADD CONSTRAINT privacy_requests_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: scheme_applications scheme_applications_scheme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheme_applications
    ADD CONSTRAINT scheme_applications_scheme_id_fkey FOREIGN KEY (scheme_id) REFERENCES public.government_schemes(id) ON DELETE CASCADE;


--
-- Name: scheme_applications scheme_applications_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheme_applications
    ADD CONSTRAINT scheme_applications_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: support_tickets support_tickets_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE SET NULL;


--
-- Name: trainee_employment trainee_employment_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_employment
    ADD CONSTRAINT trainee_employment_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainee_enrollments trainee_enrollments_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_enrollments
    ADD CONSTRAINT trainee_enrollments_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.training_programs(id) ON DELETE CASCADE;


--
-- Name: trainee_enrollments trainee_enrollments_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_enrollments
    ADD CONSTRAINT trainee_enrollments_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainee_followups trainee_followups_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_followups
    ADD CONSTRAINT trainee_followups_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainee_notifications trainee_notifications_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_notifications
    ADD CONSTRAINT trainee_notifications_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainees trainees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: verifications verifications_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: iceberg_namespaces iceberg_namespaces_catalog_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_namespaces
    ADD CONSTRAINT iceberg_namespaces_catalog_id_fkey FOREIGN KEY (catalog_id) REFERENCES storage.buckets_analytics(id) ON DELETE CASCADE;


--
-- Name: iceberg_tables iceberg_tables_catalog_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_catalog_id_fkey FOREIGN KEY (catalog_id) REFERENCES storage.buckets_analytics(id) ON DELETE CASCADE;


--
-- Name: iceberg_tables iceberg_tables_namespace_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_namespace_id_fkey FOREIGN KEY (namespace_id) REFERENCES storage.iceberg_namespaces(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: district_employment_stats Admin write district stats; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write district stats" ON public.district_employment_stats TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: government_schemes Admin write government schemes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write government schemes" ON public.government_schemes TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: recommended_opportunities Admin write opportunities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write opportunities" ON public.recommended_opportunities TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: promo_codes Admin write promo codes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write promo codes" ON public.promo_codes TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: survey_templates Admin write survey templates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write survey templates" ON public.survey_templates TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: top_skill_gaps Admin write top skill gaps; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write top skill gaps" ON public.top_skill_gaps TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: training_programs Admin write training programs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin write training programs" ON public.training_programs TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: trainee_employment Admins delete employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins delete employment" ON public.trainee_employment FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: trainee_enrollments Admins delete enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins delete enrollments" ON public.trainee_enrollments FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: trainees Admins delete trainees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins delete trainees" ON public.trainees FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: verifications Admins delete verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins delete verifications" ON public.verifications FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: trainee_enrollments Admins insert enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins insert enrollments" ON public.trainee_enrollments FOR INSERT TO authenticated WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_followups Admins insert followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins insert followups" ON public.trainee_followups FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: employers Admins manage employers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins manage employers" ON public.employers FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: job_postings Admins manage job postings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins manage job postings" ON public.job_postings FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: privacy_requests Admins manage privacy requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins manage privacy requests" ON public.privacy_requests FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: scheme_applications Admins manage scheme applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins manage scheme applications" ON public.scheme_applications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: support_tickets Admins manage support tickets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins manage support tickets" ON public.support_tickets FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: trainee_enrollments Admins update enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins update enrollments" ON public.trainee_enrollments FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: verifications Admins update verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins update verifications" ON public.verifications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: ai_policy_insights Admins view ai policy insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins view ai policy insights" ON public.ai_policy_insights FOR SELECT TO authenticated USING (public.is_admin());


--
-- Name: audit_logs Admins view audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin());


--
-- Name: platform_feedback Admins view feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins view feedback" ON public.platform_feedback FOR SELECT TO authenticated USING (public.is_admin());


--
-- Name: ai_policy_insights Admins write ai policy insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins write ai policy insights" ON public.ai_policy_insights TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: platform_feedback Anyone insert feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone insert feedback" ON public.platform_feedback FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: support_tickets Anyone insert support tickets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone insert support tickets" ON public.support_tickets FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: employers Anyone register unverified employer; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone register unverified employer" ON public.employers FOR INSERT TO authenticated, anon WITH CHECK (((is_verified = false) OR public.is_admin()));


--
-- Name: trainee_notifications Insert notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Insert notifications" ON public.trainee_notifications FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: district_employment_stats Public read district stats; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read district stats" ON public.district_employment_stats FOR SELECT TO authenticated, anon USING (true);


--
-- Name: government_schemes Public read government schemes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read government schemes" ON public.government_schemes FOR SELECT TO authenticated, anon USING (true);


--
-- Name: recommended_opportunities Public read opportunities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read opportunities" ON public.recommended_opportunities FOR SELECT TO authenticated, anon USING (true);


--
-- Name: promo_codes Public read promo codes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read promo codes" ON public.promo_codes FOR SELECT TO authenticated, anon USING (true);


--
-- Name: survey_templates Public read survey templates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read survey templates" ON public.survey_templates FOR SELECT TO authenticated, anon USING (true);


--
-- Name: top_skill_gaps Public read top skill gaps; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read top skill gaps" ON public.top_skill_gaps FOR SELECT TO authenticated, anon USING (true);


--
-- Name: training_programs Public read training programs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read training programs" ON public.training_programs FOR SELECT TO authenticated, anon USING (true);


--
-- Name: job_postings Public view active job postings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public view active job postings" ON public.job_postings FOR SELECT TO authenticated, anon USING ((((status)::text = 'active'::text) OR public.is_admin()));


--
-- Name: employers Public view verified employers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public view verified employers" ON public.employers FOR SELECT TO authenticated, anon USING (((is_verified = true) OR public.is_admin()));


--
-- Name: trainee_enrollments Read enrollments by owner, admin, or valid certificate; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Read enrollments by owner, admin, or valid certificate" ON public.trainee_enrollments FOR SELECT TO authenticated, anon USING (((trainee_id = public.get_trainee_id()) OR public.is_admin() OR (certificate_id IS NOT NULL)));


--
-- Name: user_roles Superadmins manage user roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Superadmins manage user roles" ON public.user_roles TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());


--
-- Name: audit_logs System and admins insert audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System and admins insert audit logs" ON public.audit_logs FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: trainee_notifications Trainees delete own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees delete own notifications" ON public.trainee_notifications FOR DELETE TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_employment Trainees insert own employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees insert own employment" ON public.trainee_employment FOR INSERT TO authenticated WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainees Trainees insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees insert own profile" ON public.trainees FOR INSERT TO authenticated WITH CHECK (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: verifications Trainees insert own verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees insert own verifications" ON public.verifications FOR INSERT TO authenticated WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: privacy_requests Trainees insert privacy requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees insert privacy requests" ON public.privacy_requests FOR INSERT TO authenticated WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: scheme_applications Trainees insert scheme applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees insert scheme applications" ON public.scheme_applications FOR INSERT TO authenticated WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: enterprise_ledger Trainees manage own ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees manage own ledger" ON public.enterprise_ledger TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin())) WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_employment Trainees read own employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees read own employment" ON public.trainee_employment FOR SELECT TO authenticated, anon USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_followups Trainees read own followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees read own followups" ON public.trainee_followups FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_notifications Trainees read own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees read own notifications" ON public.trainee_notifications FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainees Trainees read own profile or admin all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees read own profile or admin all" ON public.trainees FOR SELECT TO authenticated, anon USING (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: verifications Trainees read own verifications or admin all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees read own verifications or admin all" ON public.verifications FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_employment Trainees update own employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees update own employment" ON public.trainee_employment FOR UPDATE TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin())) WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_followups Trainees update own followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees update own followups" ON public.trainee_followups FOR UPDATE TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin())) WITH CHECK (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainee_notifications Trainees update own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees update own notifications" ON public.trainee_notifications FOR UPDATE TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: trainees Trainees update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees update own profile" ON public.trainees FOR UPDATE TO authenticated USING (((auth.uid() = user_id) OR public.is_admin())) WITH CHECK (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: enterprise_ledger Trainees view own ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees view own ledger" ON public.enterprise_ledger FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: privacy_requests Trainees view own privacy requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees view own privacy requests" ON public.privacy_requests FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: scheme_applications Trainees view own scheme applications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trainees view own scheme applications" ON public.scheme_applications FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: user_roles Users read own role or admin all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users read own role or admin all" ON public.user_roles FOR SELECT TO authenticated USING (((auth.uid() = user_id) OR public.is_admin()));


--
-- Name: support_tickets Users read own tickets or admin all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users read own tickets or admin all" ON public.support_tickets FOR SELECT TO authenticated USING (((trainee_id = public.get_trainee_id()) OR public.is_admin()));


--
-- Name: job_postings Verified employers or admins insert job postings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Verified employers or admins insert job postings" ON public.job_postings FOR INSERT TO authenticated WITH CHECK ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.employers
  WHERE ((employers.id = job_postings.employer_id) AND (employers.is_verified = true))))));


--
-- Name: ai_policy_insights; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ai_policy_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: district_employment_stats; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.district_employment_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: employers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

--
-- Name: enterprise_ledger; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.enterprise_ledger ENABLE ROW LEVEL SECURITY;

--
-- Name: government_schemes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

--
-- Name: job_postings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_feedback; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.platform_feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: privacy_requests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: promo_codes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: recommended_opportunities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.recommended_opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: scheme_applications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: support_tickets; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

--
-- Name: survey_templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.survey_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: top_skill_gaps; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.top_skill_gaps ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_employment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_employment ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_enrollments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_followups; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_followups ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: trainees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;

--
-- Name: training_programs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: verifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Public Verification Reads; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Verification Reads" ON storage.objects FOR SELECT USING ((bucket_id = 'verifications'::text));


--
-- Name: objects Public Verification Uploads; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Verification Uploads" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'verifications'::text));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: iceberg_namespaces; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.iceberg_namespaces ENABLE ROW LEVEL SECURITY;

--
-- Name: iceberg_tables; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.iceberg_tables ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA supabase_functions TO postgres;
GRANT USAGE ON SCHEMA supabase_functions TO anon;
GRANT USAGE ON SCHEMA supabase_functions TO authenticated;
GRANT USAGE ON SCHEMA supabase_functions TO service_role;
GRANT ALL ON SCHEMA supabase_functions TO supabase_functions_admin;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION get_trainee_id(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_trainee_id() TO anon;
GRANT ALL ON FUNCTION public.get_trainee_id() TO authenticated;
GRANT ALL ON FUNCTION public.get_trainee_id() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION is_admin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin() TO anon;
GRANT ALL ON FUNCTION public.is_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_admin() TO service_role;


--
-- Name: FUNCTION is_superadmin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_superadmin() TO anon;
GRANT ALL ON FUNCTION public.is_superadmin() TO authenticated;
GRANT ALL ON FUNCTION public.is_superadmin() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO anon;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO authenticated;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO service_role;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO postgres;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;


--
-- Name: TABLE ai_policy_insights; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_policy_insights TO anon;
GRANT ALL ON TABLE public.ai_policy_insights TO authenticated;
GRANT ALL ON TABLE public.ai_policy_insights TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: TABLE district_employment_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.district_employment_stats TO anon;
GRANT ALL ON TABLE public.district_employment_stats TO authenticated;
GRANT ALL ON TABLE public.district_employment_stats TO service_role;


--
-- Name: TABLE employers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employers TO anon;
GRANT ALL ON TABLE public.employers TO authenticated;
GRANT ALL ON TABLE public.employers TO service_role;


--
-- Name: TABLE enterprise_ledger; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.enterprise_ledger TO anon;
GRANT ALL ON TABLE public.enterprise_ledger TO authenticated;
GRANT ALL ON TABLE public.enterprise_ledger TO service_role;


--
-- Name: TABLE government_schemes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.government_schemes TO anon;
GRANT ALL ON TABLE public.government_schemes TO authenticated;
GRANT ALL ON TABLE public.government_schemes TO service_role;


--
-- Name: TABLE job_postings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.job_postings TO anon;
GRANT ALL ON TABLE public.job_postings TO authenticated;
GRANT ALL ON TABLE public.job_postings TO service_role;


--
-- Name: TABLE platform_feedback; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.platform_feedback TO anon;
GRANT ALL ON TABLE public.platform_feedback TO authenticated;
GRANT ALL ON TABLE public.platform_feedback TO service_role;


--
-- Name: TABLE privacy_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.privacy_requests TO anon;
GRANT ALL ON TABLE public.privacy_requests TO authenticated;
GRANT ALL ON TABLE public.privacy_requests TO service_role;


--
-- Name: TABLE promo_codes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promo_codes TO anon;
GRANT ALL ON TABLE public.promo_codes TO authenticated;
GRANT ALL ON TABLE public.promo_codes TO service_role;


--
-- Name: TABLE recommended_opportunities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recommended_opportunities TO anon;
GRANT ALL ON TABLE public.recommended_opportunities TO authenticated;
GRANT ALL ON TABLE public.recommended_opportunities TO service_role;


--
-- Name: TABLE scheme_applications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.scheme_applications TO anon;
GRANT ALL ON TABLE public.scheme_applications TO authenticated;
GRANT ALL ON TABLE public.scheme_applications TO service_role;


--
-- Name: TABLE support_tickets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.support_tickets TO anon;
GRANT ALL ON TABLE public.support_tickets TO authenticated;
GRANT ALL ON TABLE public.support_tickets TO service_role;


--
-- Name: TABLE survey_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.survey_templates TO anon;
GRANT ALL ON TABLE public.survey_templates TO authenticated;
GRANT ALL ON TABLE public.survey_templates TO service_role;


--
-- Name: TABLE top_skill_gaps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.top_skill_gaps TO anon;
GRANT ALL ON TABLE public.top_skill_gaps TO authenticated;
GRANT ALL ON TABLE public.top_skill_gaps TO service_role;


--
-- Name: TABLE trainee_employment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_employment TO anon;
GRANT ALL ON TABLE public.trainee_employment TO authenticated;
GRANT ALL ON TABLE public.trainee_employment TO service_role;


--
-- Name: TABLE trainee_enrollments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_enrollments TO anon;
GRANT ALL ON TABLE public.trainee_enrollments TO authenticated;
GRANT ALL ON TABLE public.trainee_enrollments TO service_role;


--
-- Name: TABLE trainee_followups; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_followups TO anon;
GRANT ALL ON TABLE public.trainee_followups TO authenticated;
GRANT ALL ON TABLE public.trainee_followups TO service_role;


--
-- Name: TABLE trainee_notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_notifications TO anon;
GRANT ALL ON TABLE public.trainee_notifications TO authenticated;
GRANT ALL ON TABLE public.trainee_notifications TO service_role;


--
-- Name: TABLE trainees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainees TO anon;
GRANT ALL ON TABLE public.trainees TO authenticated;
GRANT ALL ON TABLE public.trainees TO service_role;


--
-- Name: TABLE training_programs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.training_programs TO anon;
GRANT ALL ON TABLE public.training_programs TO authenticated;
GRANT ALL ON TABLE public.training_programs TO service_role;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;


--
-- Name: TABLE verifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.verifications TO anon;
GRANT ALL ON TABLE public.verifications TO authenticated;
GRANT ALL ON TABLE public.verifications TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_08_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_24 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_25; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_25 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_25 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_26; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_26 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_26 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_27; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_27 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_27 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_28; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_28 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_28 TO dashboard_user;


--
-- Name: TABLE messages_2026_08_29; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_08_29 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_08_29 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE iceberg_namespaces; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.iceberg_namespaces TO service_role;
GRANT SELECT ON TABLE storage.iceberg_namespaces TO authenticated;
GRANT SELECT ON TABLE storage.iceberg_namespaces TO anon;


--
-- Name: TABLE iceberg_tables; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.iceberg_tables TO service_role;
GRANT SELECT ON TABLE storage.iceberg_tables TO authenticated;
GRANT SELECT ON TABLE storage.iceberg_tables TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.hooks TO anon;
GRANT ALL ON TABLE supabase_functions.hooks TO authenticated;
GRANT ALL ON TABLE supabase_functions.hooks TO service_role;


--
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO anon;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.migrations TO anon;
GRANT ALL ON TABLE supabase_functions.migrations TO authenticated;
GRANT ALL ON TABLE supabase_functions.migrations TO service_role;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA supabase_functions GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict 9xL4uWwqiG3dLwCy83rbF4NsXubu58IWAqaoxRBL0Azn1cxSYyg9Qd320uIyogH

