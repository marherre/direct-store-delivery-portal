-- ============================================================================
-- Supabase Database Schema
-- ============================================================================
-- This file contains all tables, functions, triggers, and RLS policies
-- for the Admin Portal DSD project.
-- 
-- IMPORTANT: This file is for documentation and reference purposes.
-- To apply changes, execute the SQL commands directly in Supabase.
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: tenants
-- Description: Stores information about organizations/tenants in the system
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT tenants_name_not_empty CHECK (char_length(trim(name)) > 0)
);

-- Table comments
COMMENT ON TABLE public.tenants IS 'Table of organizations/tenants in the system';
COMMENT ON COLUMN public.tenants.id IS 'Unique identifier of the tenant';
COMMENT ON COLUMN public.tenants.name IS 'Name of the tenant';
COMMENT ON COLUMN public.tenants.email IS 'Email address of the tenant';
COMMENT ON COLUMN public.tenants.is_active IS 'Indicates if the tenant is active';
COMMENT ON COLUMN public.tenants.created_at IS 'Record creation date';
COMMENT ON COLUMN public.tenants.updated_at IS 'Last update date';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_name ON public.tenants(name);
-- ----------------------------------------------------------------------------
-- Table: tenant_users
-- Description: Relationship between authentication users and tenants (many-to-many)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    supabase_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_super_admin BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicates: a user can only be in a tenant once
    -- Note: NULL values are allowed and multiple NULLs are permitted per user
    CONSTRAINT tenant_users_unique_user_tenant UNIQUE (tenant_id, supabase_user_id)
);

-- Table comments
COMMENT ON TABLE public.tenant_users IS 'Relationship between authentication users and tenants';
COMMENT ON COLUMN public.tenant_users.id IS 'Unique identifier of the relationship';
COMMENT ON COLUMN public.tenant_users.tenant_id IS 'Tenant ID (FK to tenants). Can be NULL for users without a specific tenant assignment.';
COMMENT ON COLUMN public.tenant_users.supabase_user_id IS 'Supabase authentication user ID (FK to auth.users)';
COMMENT ON COLUMN public.tenant_users.is_super_admin IS 'Indicates if the user is a super admin';
COMMENT ON COLUMN public.tenant_users.is_active IS 'Indicates if the relationship is active';
COMMENT ON COLUMN public.tenant_users.created_at IS 'Record creation date';
COMMENT ON COLUMN public.tenant_users.updated_at IS 'Last update date';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_supabase_user_id ON public.tenant_users(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_is_super_admin ON public.tenant_users(is_super_admin);



-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: update_updated_at_column
-- Description: Automatically updates the updated_at field
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tenants
DROP TRIGGER IF EXISTS update_tenants_updated_at ON public.tenants;
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Apply trigger to tenant_users
DROP TRIGGER IF EXISTS update_tenant_users_updated_at ON public.tenant_users;
CREATE TRIGGER update_tenant_users_updated_at
    BEFORE UPDATE ON public.tenant_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- FUNCTIONS (RPC)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: user_authentication
-- Description: Returns authentication information for the current user
-- Returns: JSON object with is_super_admin (BOOLEAN), tenant_id (UUID or NULL), and tenant_name (TEXT or NULL)
-- Usage: SELECT user_authentication();
-- Note: This function checks if the user has is_super_admin = true
--       in the tenant_users table and is_active = true, and returns the associated tenant_id and tenant_name
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.user_authentication()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
    auth_result JSON;
    is_admin BOOLEAN := false;
    user_tenant_id UUID := NULL;
    user_tenant_name TEXT := NULL;
BEGIN
    -- Get the ID of the current authenticated user
    current_user_id := auth.uid();
    
    -- If there is no authenticated user, return null values
    IF current_user_id IS NULL THEN
        RETURN json_build_object(
            'is_super_admin', false,
            'tenant_id', NULL,
            'tenant_name', NULL
        );
    END IF;
    
    -- Get user's admin status, tenant_id, and tenant_name from tenant_users and tenants tables
    SELECT 
        tu.is_super_admin,
        tu.tenant_id,
        t.name
    INTO 
        is_admin,
        user_tenant_id,
        user_tenant_name
    FROM public.tenant_users tu
    LEFT JOIN public.tenants t ON tu.tenant_id = t.id
    WHERE tu.supabase_user_id = current_user_id 
    AND tu.is_active = true
    ORDER BY tu.is_super_admin DESC, tu.created_at ASC
    LIMIT 1;
    
    -- Build and return JSON result
    RETURN json_build_object(
        'is_super_admin', COALESCE(is_admin, false),
        'tenant_id', user_tenant_id,
        'tenant_name', user_tenant_name
    );
END;
$$;

-- Function comment
COMMENT ON FUNCTION public.user_authentication() IS 
'Returns authentication information for the current user including super admin status, tenant_id, and tenant_name';


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Enable RLS on tenant_users
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- RLS Policies for tenants
-- ----------------------------------------------------------------------------

-- Only super admins can view tenants
CREATE POLICY "Only super admins can view tenants"
    ON public.tenants
    FOR SELECT
    USING (public.check_user_is_admin());

-- Only system admins can insert tenants
-- TODO: Adjust according to your permission logic
CREATE POLICY "Only system admins can insert tenants"
    ON public.tenants
    FOR INSERT
    WITH CHECK (public.check_user_is_admin());

-- Only system admins can update tenants
CREATE POLICY "Only system admins can update tenants"
    ON public.tenants
    FOR UPDATE
    USING (public.check_user_is_admin())
    WITH CHECK (public.check_user_is_admin());

-- Only system admins can delete tenants
CREATE POLICY "Only system admins can delete tenants"
    ON public.tenants
    FOR DELETE
    USING (public.check_user_is_admin());

-- ----------------------------------------------------------------------------
-- RLS Policies for tenant_users
-- ----------------------------------------------------------------------------

-- Users can view their own relationships with tenants
CREATE POLICY "Users can view their own tenant relationships"
    ON public.tenant_users
    FOR SELECT
    USING (auth.uid() = supabase_user_id);

-- Super admins can view all tenant users
CREATE POLICY "Super admins can view tenant users"
    ON public.tenant_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tenant_users tu
            WHERE tu.supabase_user_id = auth.uid()
            AND tu.is_super_admin = true
            AND tu.is_active = true
        )
    );

-- System admins can insert any tenant-user relationship (including NULL tenant_id)
-- Regular users can only insert if they are in the same tenant
-- Note: Relationships with NULL tenant_id can only be created by system admins
CREATE POLICY "System admins or same-tenant users can insert tenant users"
    ON public.tenant_users
    FOR INSERT
    WITH CHECK (
        public.check_user_is_admin() OR
        EXISTS (
            SELECT 1 FROM public.tenant_users tu
            WHERE tu.supabase_user_id = auth.uid()
            AND tu.tenant_id = tenant_users.tenant_id
            AND tu.is_active = true
        )
    );

-- System admins can update any tenant-user relationship (including NULL tenant_id)
-- Regular users can only update if they are in the same tenant
-- Note: Relationships with NULL tenant_id can only be updated by system admins
CREATE POLICY "System admins or same-tenant users can update tenant users"
    ON public.tenant_users
    FOR UPDATE
    USING (
        public.check_user_is_admin() OR
        EXISTS (
            SELECT 1 FROM public.tenant_users tu
            WHERE tu.supabase_user_id = auth.uid()
            AND tu.tenant_id = tenant_users.tenant_id
            AND tu.is_active = true
        )
    )
    WITH CHECK (
        public.check_user_is_admin() OR
        EXISTS (
            SELECT 1 FROM public.tenant_users tu
            WHERE tu.supabase_user_id = auth.uid()
            AND tu.tenant_id = tenant_users.tenant_id
            AND tu.is_active = true
        )
    );

-- System admins can delete any tenant-user relationship (including NULL tenant_id)
-- Regular users can only delete if they are in the same tenant
-- Note: Relationships with NULL tenant_id can only be deleted by system admins
CREATE POLICY "System admins or same-tenant users can delete tenant users"
    ON public.tenant_users
    FOR DELETE
    USING (
        public.check_user_is_admin() OR
        EXISTS (
            SELECT 1 FROM public.tenant_users tu
            WHERE tu.supabase_user_id = auth.uid()
            AND tu.tenant_id = tenant_users.tenant_id
            AND tu.is_active = true
        )
    );


-- ============================================================================
-- USEFUL VIEWS (OPTIONAL)
-- ============================================================================

-- View: users with their active tenants
CREATE OR REPLACE VIEW public.user_tenants_view AS
SELECT 
    tu.supabase_user_id AS user_id,
    tu.tenant_id,
    t.name AS tenant_name,
    t.email AS tenant_email,
    t.is_active AS tenant_is_active,
    tu.is_super_admin,
    tu.is_active AS relationship_is_active,
    tu.created_at AS joined_at
FROM public.tenant_users tu
INNER JOIN public.tenants t ON tu.tenant_id = t.id
WHERE tu.is_active = true AND t.is_active = true;

COMMENT ON VIEW public.user_tenants_view IS 
'View that shows the active tenants for each user. Note: Only includes users with a tenant_id assigned (excludes NULL tenant_id relationships).';

-- ============================================================================
-- SEED DATA (OPTIONAL)
-- ============================================================================

-- Uncomment and adjust as needed for initial data
/*
-- Insert example tenant
INSERT INTO public.tenants (name, email) 
VALUES ('Default Tenant', 'admin@default.com')
ON CONFLICT (email) DO NOTHING;
*/

-- ============================================================================
-- NOTES AND REMINDERS
-- ============================================================================

-- TODO: Add more RPC functions as needed:
-- - get_user_tenants(user_id)
-- - get_tenant_users(tenant_id)
-- - check_user_is_tenant_admin(user_id, tenant_id)

-- TODO: Consider adding audit logging (table for change logs)
-- TODO: Consider soft deletes (deleted_at field) instead of physical DELETE

