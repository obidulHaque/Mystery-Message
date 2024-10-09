import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/user";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "user don't exiest" },
        { status: 403 }
      );
    }
    const isCodeValid = user?.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
    }
    if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Code was Expired",
      });
    }
    return Response.json({
      success: true,
      message: "verification successful",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "verification fail" });
  }
}
