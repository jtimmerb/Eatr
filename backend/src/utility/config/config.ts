export const Postgres = {
  host: process.env.PG_HOST || '',
  user: process.env.PG_USERNAME || '',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || '',
  port: parseInt(process.env.PG_PORT || '') || 8080,
};

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const API_VERSION = '/api/v1';
export const PORT = 8080;
