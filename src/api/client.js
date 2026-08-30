// Thin wrapper around the FastAPI backend. Every function here maps 1:1 to a
// real route in the backend — ported directly from the web app's api/client.js.

import { API_BASE_URL } from '../config';

const BASE = API_BASE_URL;
const V1 = `${BASE}/api/v1`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// ---- Reads ----
export const getHealth = () => request(`${BASE}/health`);
export const getDashboardOverview = () => request(`${V1}/dashboard/overview`);
export const getTimeline = () => request(`${V1}/dashboard/timeline`);
export const getPropagationTimeline = (topic, limit = 20) => {
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  params.set('limit', limit);
  return request(`${V1}/network/propagation-timeline?${params.toString()}`);
};

// ---- Ingestion triggers (writes) ----
export const ingestMock = (count = 30) =>
  request(`${V1}/ingest/mock?count=${count}`, { method: 'POST' });

export const ingestReddit = (subreddit = 'technology', limit = 15) =>
  request(`${V1}/ingest/reddit?subreddit=${encodeURIComponent(subreddit)}&limit=${limit}`, { method: 'POST' });

export const ingestTelegram = (channel = 'durov', limit = 15) =>
  request(`${V1}/ingest/telegram?channel=${encodeURIComponent(channel)}&limit=${limit}`, { method: 'POST' });

export const ingestX = (query = 'technology', limit = 15) =>
  request(`${V1}/ingest/x?query=${encodeURIComponent(query)}&limit=${limit}`, { method: 'POST' });

export const ingestBatchLive = () =>
  request(`${V1}/ingest/batch-live`, { method: 'POST' });

export const runPipeline = () =>
  request(`${V1}/analytics/run-pipeline`, { method: 'POST' });
