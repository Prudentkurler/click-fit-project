import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');

dotenv.config({
  path: envPath,
  quiet: true
});

function requiredString(environment, key) {
  const value = environment[key];

  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return String(value).trim();
}

export function loadConfig(environment = process.env) {
  const port = Number(environment.PORT || 3000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return {
    port,
    database: {
      host: requiredString(environment, 'DB_HOST'),
      user: requiredString(environment, 'DB_USER'),
      password: requiredString(environment, 'DB_PASSWORD'),
      name: requiredString(environment, 'DB_NAME')
    }
  };
}

export const config = loadConfig();

export const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function checkDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}

export async function callAddUser(connection, input) {
  const [result] = await connection.query(
    'CALL adduser(?, ?, ?, ?)',
    [input.email, input.password, input.type, input.active]
  );

  return result;
}

export async function addUser(input) {
  const connection = await pool.getConnection();

  try {
    return await callAddUser(connection, input);
  } finally {
    connection.release();
  }
}
