import { NextResponse } from 'next/server';
import { getChecks, searchChecks } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (query) {
      const results = await searchChecks(query);
      return NextResponse.json({ checks: results });
    }

    const data = await getChecks(limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Failed to get history' },
      { status: 500 }
    );
  }
}
