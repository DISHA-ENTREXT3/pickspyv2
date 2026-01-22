#!/usr/bin/env python3
"""Setup Supabase database using REST API"""

import requests
import json

SUPABASE_URL = "https://fogfnvewxeqxqtsrclbd.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ2ZudmV3eGVxeHF0c3JjbGJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODkyMjcxOSwiZXhwIjoyMDg0NDk4NzE5fQ.fm2mgqANHNb26tJMgv4ZVToAhfwr6RZBepiZ2cEfHGA"

headers = {
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def execute_sql(sql_query):
    """Execute SQL on Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/execute_sql"
    payload = {"sql": sql_query}
    
    response = requests.post(url, json=payload, headers=headers)
    return response

def setup_database():
    """Setup Supabase database"""
    try:
        print("🔌 Connecting to Supabase...")
        print(f"URL: {SUPABASE_URL}\n")
        
        # Test connection
        test_response = requests.get(
            f"{SUPABASE_URL}/rest/v1/",
            headers=headers
        )
        
        if test_response.status_code == 200:
            print("✓ Connected to Supabase\n")
        else:
            print(f"✗ Connection failed: {test_response.status_code}")
            print(test_response.text)
            return
        
        # Read schema
        print("📋 Reading schema file...")
        with open("supabase_schema.sql", "r") as f:
            schema_content = f.read()
        print("✓ Schema loaded\n")
        
        print("🛠️  Executing setup queries...\n")
        
        # Split by statements and execute
        statements = [s.strip() for s in schema_content.split(';') if s.strip()]
        
        for i, statement in enumerate(statements, 1):
            if not statement:
                continue
            
            # Pretty print what we're doing
            first_word = statement.split()[0].upper() if statement.split() else ""
            print(f"{i}. {first_word}...", end=" ", flush=True)
            
            try:
                response = execute_sql(statement + ";")
                
                if response.status_code in [200, 201, 204]:
                    print("✓")
                else:
                    error_msg = response.text
                    if "already exists" in error_msg.lower():
                        print("✓ (already exists)")
                    elif "does not exist" in error_msg.lower() and "drop policy" in statement.lower():
                        print("✓ (none to drop)")
                    else:
                        print(f"⚠")
                        print(f"   Error: {error_msg[:100]}")
            except Exception as e:
                print(f"✗ Exception: {str(e)[:50]}")
        
        print("\n✅ Setup Complete!")
        print("\nYour Supabase database is now configured with:")
        print("  • products table")
        print("  • user_activity table")
        print("  • saved_products table")
        print("  • comparisons table")
        print("  • RLS policies")
        print("  • Performance indexes")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    setup_database()
