import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import Item from '@/models/Item';

export async function GET() {
  await connectToDB();
  const items = await Item.find({}).populate('category');
  return NextResponse.json(items);
}

export async function POST(req) {
  await connectToDB();
  const { name, description, unit, category, basePrice, quarterPrice, halfPrice, fullPrice } = await req.json();
  const newItem = new Item({ name, description, unit, category, basePrice, quarterPrice, halfPrice, fullPrice });
  await newItem.save();
  return NextResponse.json(newItem, { status: 201 });
}
