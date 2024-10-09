import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/user";
import { getServerSession } from "next-auth";
import { authProvider } from "../auth/[...nextauth]/option";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authProvider);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "user Doesn't existe" },
      { status: 403 }
    );
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updated = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessage },
      { new: true }
    );
    if (!updated) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "Unable to find updated to user message acceptance status",
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "accept-message fail" },
      { status: 404 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authProvider);
  const user = session?.user;
  // console.log(user);
  if (!session || !user) {
    return Response.json({
      success: false,
      message: "session and user doesn't existe ",
    });
  }
  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
