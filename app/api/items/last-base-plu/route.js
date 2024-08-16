import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import Item from '@/models/Item';

export async function GET() {
  await connectToDB();
  const lastItem = await Item.findOne().sort({ 'basePrice.plu': -1 });
  const lastPLU = lastItem ? parseInt(lastItem.basePrice.plu) : 0;
  return NextResponse.json({ lastPLU });
}