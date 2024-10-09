"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Input } from "@/components/ui/input";
import { sendMessageSchema } from "@/schemas/sendMessageSchema";
import Messages from "@/Messages.json";
import Autoplay from "embla-carousel-autoplay";
import Footer from "@/components/Footer";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function page() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      username: "",
      content: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    try {
      const response = await axios.post("/api/send-message", values);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      toast({
        title: "User Not accpeting any message",
      });
    }
  }

  return (
    <>
      <div className="relative">
        {session?.user && (
          <Button
            variant={"ghost"}
            className="absolute right-8 mt-10 lg:text-[1vw] text-[2vw] lg:px-5 lg:py-2 px-2 "
          >
            <Link href="/dashboard">Your Message</Link>
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:space-y-6 space-y-2 lg:mt-10 mt-20 w-[30vw] ml-10"
        >
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input {...field} className="rounded-xl lg:w-[30vw] w-[70vw]" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <Input
                  {...field}
                  className="rounded-xl h-[10vw] lg:w-[30vw] w-[70vw] resize-none"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" variant={"ghost"}>
            Send
          </Button>
        </form>
      </Form>
      <div className="flex justify-center items-center lg:mt-10 mt-20">
        <Carousel
          orientation="vertical"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="-mt-1 h-[200px]">
            {Messages.map((msg, index) => (
              <CarouselItem
                key={index}
                className="flex  justify-center items-center"
              >
                <div className="flex flex-col gap-8">
                  <h1>Title: {msg.title}</h1>
                  <p>Msg: {msg.content}</p>
                  <p className="ml-10">Time: {msg.received}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <Footer />
    </>
  );
}
