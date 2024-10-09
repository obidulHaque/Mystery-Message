import { Message } from "@/Model/user";

export default interface apiResponse {
  success: boolean;
  message: string;
  acceptMessage?: [Message];
}
