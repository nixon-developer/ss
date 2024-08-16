// import { NextResponse } from 'next/server';
// import connectToDB from '@/utils/db';
// import ItemCategory from '@/models/ItemCategory';

// export async function GET(req, { params }) {
//   await connectToDB();
//   const { id } = params;
//   const itemCategory = await ItemCategory.findById(id).populate('groupId');
//   if (!itemCategory) {
//     return NextResponse.json({ message: 'ItemCategory not found' }, { status: 404 });
//   }
//   return NextResponse.json(itemCategory);
// }

// export async function PUT(req, { params }) {
//   await connectToDB();
//   const { id } = params;
//   const { groupId, name, active } = await req.json();
//   const itemCategory = await ItemCategory.findByIdAndUpdate(id, { groupId, name, active }, { new: true });
//   if (!itemCategory) {
//     return NextResponse.json({ message: 'ItemCategory not found' }, { status: 404 });
//   }
//   return NextResponse.json(itemCategory);
// }

// export async function DELETE(req, { params }) {
//   await connectToDB();
//   const { id } = params;
//   const itemCategory = await ItemCategory.findByIdAndDelete(id);
//   if (!itemCategory) {
//     return NextResponse.json({ message: 'ItemCategory not found' }, { status: 404 });
//   }
//   return new NextResponse(null, { status: 204 });
// }









import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import ItemCategory from '@/models/ItemCategory';

export async function GET(req, { params }) {
  await connectToDB();
  const { id } = params;
  const itemCategory = await ItemCategory.findById(id).populate('groupId', 'name');
  if (!itemCategory) {
    return NextResponse.json({ message: 'ItemCategory not found' }, { status: 404 });
  }
  return NextResponse.json(itemCategory);
}

export async function PUT(req, { params }) {
  await connectToDB();
  const { id } = params;
  const { name, active, groupId } = await req.json();
  const itemCategory = await ItemCategory.findByIdAndUpdate(id, { name, active, groupId }, { new: true });
  if (!itemCategory) {
    return NextResponse.json({ message: 'ItemCategory not found' }, { status: 404 });
  }
  return NextResponse.json(itemCategory);
}

export async function DELETE(req, { params }) {
  await connectToDB();
  const { id } = params;
  const itemCategory = await ItemCategory.findByIdAndDelete(id);
  if (!itemCategory) {
    return NextResponse.json({ message: 'ItemCategory not found' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
