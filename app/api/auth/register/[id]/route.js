import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import User from '@/models/User';

export async function GET(req, { params }) {
  await connectToDB();
  const { id } = params;
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(req, { params }) {
  await connectToDB();
  const { id } = params;
  const { name, username, password, userRole, active } = await req.json();
  const user = await User.findByIdAndUpdate(id, { name, username, password, userRole, active }, { new: true });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function DELETE(req, { params }) {
  await connectToDB();
  const { id } = params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
