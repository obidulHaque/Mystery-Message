import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
const usernameUniqe = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameUniqe.safeParse(queryParam);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json({
        seccess: false,
        message:
          usernameError?.length > 0 ? usernameError.join("") : "Invalid Query",
      });
    }
    const { username } = result.data;

    const usernameExist = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (usernameExist) {
      return Response.json({
        success: false,
        message: "Username taken",
      });
    }

    return Response.json({
      success: true,
      message: "Username id unique",
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Username uniqe cheeck Fail",
      },
      { status: 500 }
    );
  }
}
