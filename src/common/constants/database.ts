export const DATABASE_DEFAULTS = {
  sqlite: {
    type: "sqlite" as const,
    database: "app.db",
  },
  postgres: {
    type: "postgres" as const,
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "myapp",
  },
  mysql: {
    type: "mysql" as const,
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "myapp",
  },
} as const;

// Database type options
export const DATABASE_TYPES = [
  { value: "sqlite", label: "SQLite" },
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
] as const;