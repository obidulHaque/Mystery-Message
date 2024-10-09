"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { useCallback, useState, useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import apiResponse from "@/type/apiResponse";
import dayjs from "dayjs";
import { Msg } from "@/type/msg";
import { MessageCard } from "@/components/messageCard";

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const { register, watch, setValue } = useForm<
    z.infer<typeof AcceptMessageSchema>
  >({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const acceptMessage = watch("acceptMessage");

  const profileUrl = useMemo(() => {
    if (!session?.user) return "";
    return `${window.location.protocol}//${window.location.host}/u/${session.user.username}`;
  }, [session]);

  const fetchMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const { data } = await axios.get("/api/accept-message");
      setValue("acceptMessage", data.isAcceptingMessages);
      toast({ title: "Message status updated successfully" });
    } catch (error) {
      toast({ title: "Message status updated Fail" });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/get-messages");
        setMessages(data.messages || []);
        if (refresh) {
          toast({
            title: "Messages Refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const deleteMessage = useCallback(
    async (msgId: string) => {
      try {
        const { data } = await axios.post("/api/delete-message", {
          msg: msgId,
        });
        toast({
          title: data.message,
          variant: data.success ? "default" : "destructive",
        });
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== msgId)
        );
      } catch {
        toast({ title: "Failed to delete message", variant: "destructive" });
      }
    },
    [toast]
  );

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchMessageStatus();
    }
  }, [session, fetchMessages, fetchMessageStatus]);

  const handleSwitch = async () => {
    setIsSwitchLoading(true);
    try {
      const { data } = await axios.post("/api/accept-message", {
        acceptMessage: !acceptMessage,
      });
      setValue("acceptMessage", !acceptMessage);
      toast({ title: data.message });
    } catch {
      toast({
        title: "Failed to change message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // const copyToClipboard = () => {
  //   if (profileUrl) {
  //     navigator.clipboard.writeText(profileUrl);
  //     toast({
  //       title: "URL Copied!",
  //       description: "Profile URL has been copied to clipboard.",
  //     });
  //   }
  // };

  // if (!session?.user) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-[3vw]">
  //       Please Login
  //     </div>
  //   );
  // }

  return (
    <div className="lg:mx-36 lg:my-5 mx-10 my-10">
      <h1 className="lg:text-[3vw] text-[6vw]">User Dashboard</h1>
      {/* <p className="text-[1.2vw]">Copy Your Unique Link</p> */}
      {/* <div className="flex gap-3 mt-3">
        <Input value={profileUrl} className="rounded-xl" disabled />
        <Button variant="ghost" onClick={copyToClipboard}>
          Copy
        </Button>
      </div> */}

      <div className="flex gap-3 mt-5 items-center lg:text-[1.5vw] text-[4vw]">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessage}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <p>Accepting Messages: {acceptMessage ? "On" : "Off"}</p>
      </div>

      <Separator className="my-5" />

      <Button
        variant="ghost"
        onClick={() => fetchMessages(true)}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
      </Button>

      <div className="lg:mt-5 mt-10  flex flex-wrap gap-10 justify-center">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCard
              key={msg._id}
              msg={msg}
              deleteMessage={deleteMessage}
            />
          ))
        ) : (
          <div>No messages available</div>
        )}
      </div>
    </div>
  );
}
