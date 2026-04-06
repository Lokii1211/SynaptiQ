import psycopg2

conn = psycopg2.connect(
    "postgresql://postgres:LokiKavi1211@db.fogqoiksiebfidxfrydx.supabase.co:5432/postgres?sslmode=require"
)
cur = conn.cursor()

# List all tables
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
tables = cur.fetchall()
print(f"Total tables: {len(tables)}\n")

# Count rows in each table
for (t,) in tables:
    try:
        cur.execute(f"SELECT COUNT(*) FROM \"{t}\"")
        count = cur.fetchone()[0]
        print(f"  {t}: {count} rows")
    except Exception as e:
        conn.rollback()
        print(f"  {t}: ERROR - {e}")

conn.close()
print("\nDatabase ready!")
