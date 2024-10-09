import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/user";
import { getServerSession } from "next-auth";
import { authProvider } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authProvider);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 400 }
    );
  }
  const { msg } = await request.json();
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: msg } } }
    );
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
