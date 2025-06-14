import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import User from "../../../../models/User";
import { error } from "console";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User Already Existed",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.create({
      email,
      password,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Error occured while creating user",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Registration Error:", error);
    return NextResponse.json(
      {
        error: "Failed to register user",
      },
      {
        status: 400,
      }
    );
  }
}
