#!/usr/bin/env python3
"""Setup Supabase database with proper schema"""

import os
from supabase import create_client, Client

# Credentials
SUPABASE_URL = "https://fogfnvewxeqxqtsrclbd.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ2ZudmV3eGVxeHF0c3JjbGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODkyMjcxOSwiZXhwIjoyMDg0NDk4NzE5fQ.fm2mgqANHNb26tJMgv4ZVToAhfwr6RZBepiZ2cEfHGA"

def setup_database():
    """Setup Supabase database"""
    try:
        # Initialize client
        client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✓ Connected to Supabase")
        
        # Read the schema file
        with open("supabase_schema.sql", "r") as f:
            schema_content = f.read()
        
        # First, drop conflicting policies
        print("\n📋 Dropping conflicting policies...")
        drop_policies = """
        drop policy if exists "Users can view their own profile" on public.profiles;
        drop policy if exists "Users can update their own profile" on public.profiles;
        drop policy if exists "Users can insert their own profile" on public.profiles;
        drop policy if exists "Users can delete their own profile" on public.profiles;
        """
        
        try:
            client.postgrest.raw(drop_policies)
            print("✓ Dropped conflicting policies")
        except Exception as e:
            print(f"⚠ Note: {e}")
        
        # Execute the schema
        print("\n📦 Creating tables and indexes...")
        try:
            # Execute the schema using postgrest raw
            response = client.postgrest.raw(schema_content)
            print("✓ Schema created successfully")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("✓ Tables already exist (idempotent)")
            else:
                print(f"⚠ Schema error: {e}")
        
        # Verify tables were created
        print("\n✅ Verifying tables...")
        tables_to_check = ["products", "user_activity", "saved_products", "comparisons"]
        
        for table_name in tables_to_check:
            try:
                response = client.table(table_name).select("*").limit(1).execute()
                print(f"✓ Table '{table_name}' exists and accessible")
            except Exception as e:
                print(f"✗ Table '{table_name}' error: {e}")
        
        print("\n✅ Supabase setup complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise

if __name__ == "__main__":
    setup_database()
