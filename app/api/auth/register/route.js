import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import User from '@/models/User';
import { hash } from 'bcrypt';
import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  userRole: Joi.string().required(),
  active: Joi.boolean().optional(),
});

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred while fetching users.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { error } = userSchema.validate(data);
    if (error) {
      return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    const { name, username, password, userRole, active } = data;
    await connectToDB();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists.' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      userRole,
      active,
    });

    await newUser.save();
    return NextResponse.json({ message: 'User registered.' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: `An error occurred while registering the user: ${error.message}` }, { status: 500 });
  }
}
