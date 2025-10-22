

import { Client, types } from 'pg';
import log from '../logger/logger';

types.setTypeParser(1114 /*Timestamp*/, function (stringValue) {
  return stringValue;
});
types.setTypeParser(1082 /*Date*/, function (stringValue) {
  return stringValue;
});

export default function getClient(): Client {
  log.debug( {
      host: process.env.DB_HOST || "db",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "myapp",
    })
  return new Client(//
     {
      host: process.env.DB_HOST || "db",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "myapp",
    });
}
