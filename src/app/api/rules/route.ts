import { NextRequest, NextResponse } from 'next/server';
import { BusinessRule } from '../../../types/rules';
import { promises as fs } from 'fs';
import path from 'path';

const RULES_PATH = path.join(process.cwd(), 'rules.json');

async function readRules(): Promise<BusinessRule[]> {
  try {
    const data = await fs.readFile(RULES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function writeRules(rules: BusinessRule[]) {
  await fs.writeFile(RULES_PATH, JSON.stringify(rules, null, 2), 'utf-8');
}

export async function GET() {
  const rules = await readRules();
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const rules = await readRules();
  const newRule = await req.json();
  rules.push({ ...newRule, id: Date.now().toString() });
  await writeRules(rules);
  return NextResponse.json(rules);
}

export async function PUT(req: NextRequest) {
  const rules = await readRules();
  const updatedRule = await req.json();
  const idx = rules.findIndex(r => r.id === updatedRule.id);
  if (idx !== -1) {
    rules[idx] = updatedRule;
    await writeRules(rules);
    return NextResponse.json(rules);
  }
  return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const rules = await readRules();
  const { id } = await req.json();
  const filtered = rules.filter(r => r.id !== id);
  await writeRules(filtered);
  return NextResponse.json(filtered);
} 