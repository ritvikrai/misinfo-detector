import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHECKS_FILE = path.join(DATA_DIR, 'checks.json');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Fact checks
export async function saveCheck(check) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(CHECKS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { checks: [], stats: { total: 0, verdicts: {} } };
  }
  
  const entry = {
    id: Date.now().toString(),
    ...check,
    createdAt: new Date().toISOString(),
  };
  
  data.checks.unshift(entry);
  data.checks = data.checks.slice(0, 500);
  data.stats.total++;
  data.stats.verdicts[check.verdict] = (data.stats.verdicts[check.verdict] || 0) + 1;
  
  await fs.writeFile(CHECKS_FILE, JSON.stringify(data, null, 2));
  return entry;
}

export async function getChecks(limit = 50) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(CHECKS_FILE, 'utf-8');
    const data = JSON.parse(file);
    return {
      checks: data.checks.slice(0, limit),
      stats: data.stats,
    };
  } catch (e) {
    return { checks: [], stats: { total: 0, verdicts: {} } };
  }
}

export async function searchChecks(query) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(CHECKS_FILE, 'utf-8');
    const data = JSON.parse(file);
    
    const normalized = query.toLowerCase();
    const matches = data.checks.filter(c => 
      c.claim?.toLowerCase().includes(normalized) ||
      c.explanation?.toLowerCase().includes(normalized)
    );
    
    return matches;
  } catch (e) {
    return [];
  }
}

// Community reports
export async function saveReport(report) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(REPORTS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { reports: [] };
  }
  
  const entry = {
    id: Date.now().toString(),
    ...report,
    votes: { accurate: 0, inaccurate: 0 },
    createdAt: new Date().toISOString(),
  };
  
  data.reports.unshift(entry);
  await fs.writeFile(REPORTS_FILE, JSON.stringify(data, null, 2));
  return entry;
}

export async function getReports() {
  await ensureDataDir();
  try {
    const file = await fs.readFile(REPORTS_FILE, 'utf-8');
    return JSON.parse(file).reports;
  } catch (e) {
    return [];
  }
}
