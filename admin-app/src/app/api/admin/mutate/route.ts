import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table, action, payload, match, onConflict, select = '*' } = body;

    if (!table) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let query: any = supabase.from(table);

    if (action === 'insert') {
      const { data, error } = await query.insert(payload).select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'upsert') {
      const { data, error } = await query.upsert(payload, onConflict ? { onConflict } : undefined).select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'update') {
      if (!match || Object.keys(match).length === 0) {
        return NextResponse.json({ error: 'Update requires match criteria' }, { status: 400 });
      }
      Object.entries(match).forEach(([col, val]) => {
        query = query.eq(col, val);
      });
      const { data, error } = await query.update(payload).select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'delete') {
      if (!match || Object.keys(match).length === 0) {
        return NextResponse.json({ error: 'Delete requires match criteria' }, { status: 400 });
      }
      Object.entries(match).forEach(([col, val]) => {
        query = query.eq(col, val);
      });
      const { data, error } = await query.delete().select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: `Invalid action: "${action}"` }, { status: 400 });
  } catch (err: any) {
    console.error('Admin Server Mutation Error:', err);
    return NextResponse.json(
      { error: err.message || 'Database mutation failed', details: err.details },
      { status: 500 }
    );
  }
}
