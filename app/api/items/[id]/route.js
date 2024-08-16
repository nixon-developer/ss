import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import Item from '@/models/Item';

export async function GET(req, { params }) {
  await connectToDB();
  const { id } = params;
  const item = await Item.findById(id).populate('category');
  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(req, { params }) {
  await connectToDB();
  const { id } = params;
  const { name, description, unit, category, basePrice, quarterPrice, halfPrice, fullPrice } = await req.json();
  const item = await Item.findByIdAndUpdate(id, { name, description, unit, category, basePrice, quarterPrice, halfPrice, fullPrice }, { new: true });
  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(req, { params }) {
  await connectToDB();
  const { id } = params;
  const item = await Item.findByIdAndDelete(id);
  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
