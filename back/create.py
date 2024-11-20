import psycopg2

connection = psycopg2.connect(
    user="genn",
    password="12345",
    host="localhost",
    port="5432"
)

connection.autocommit = True  # Enable autocommit mode

# Create a cursor
cursor = connection.cursor()

# Create a new database
cursor.execute("CREATE DATABASE dbname;")

# Close the cursor and connection
cursor.close()
connection.close()
