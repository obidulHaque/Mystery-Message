import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/user";
import { Message } from "@/Model/user";
export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "message accpt user not found ",
        },
        { status: 402 }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "user not accpt message  ",
        },
        { status: 402 }
      );
    }
    const message = { content, createdAt: new Date() };
    user?.messages.push(message as Message);
    await user.save();
    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(error, "message sent Fail");
    return Response.json(
      {
        success: false,
        message: "message sent Fail",
      },
      { status: 504 }
    );
  }
}
