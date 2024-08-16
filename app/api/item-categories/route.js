// import { NextResponse } from 'next/server';
// import connectToDB from '@/utils/db';
// import ItemCategory from '@/models/ItemCategory';

// export async function GET() {
//   await connectToDB();
//   const itemCategories = await ItemCategory.find({}).populate('groupId');
//   return NextResponse.json(itemCategories);
// }

// export async function POST(req) {
//   await connectToDB();
//   const { groupId, name, active } = await req.json();
//   const newItemCategory = new ItemCategory({ groupId, name, active });
//   await newItemCategory.save();
//   return NextResponse.json(newItemCategory, { status: 201 });
// }










import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import ItemCategory from '@/models/ItemCategory';

export async function GET() {
  await connectToDB();
  const itemCategories = await ItemCategory.find({}).populate('groupId', 'name');
  return NextResponse.json(itemCategories);
}

export async function POST(req) {
  await connectToDB();
  const { name, active, groupId } = await req.json();
  const newItemCategory = new ItemCategory({ name, active, groupId });
  await newItemCategory.save();
  return NextResponse.json(newItemCategory, { status: 201 });
}
