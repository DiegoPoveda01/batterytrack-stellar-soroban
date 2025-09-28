// Simple in-memory store for demo purposes.
// In production, replace with a DB (Postgres, Mongo, etc.).

export const batteries = new Map(); // id -> battery object
export const events = []; // append-only for audit/demo

export function resetStore() {
  batteries.clear();
  events.length = 0;
}
