"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
  const param = useParams<{ username: string }>();
  const [submit, setSubmit] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof verifySchema>) {
    try {
      setSubmit(true);
      const response = await axios.post("/api/verify", {
        username: param.username,
        code: values.code,
      });
      toast({
        title: response.data.status,
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      toast({
        title: "verify Fail",
      });
    } finally {
      setSubmit(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className=" w-full max-w-md p-8 space-y-8 bg-gray-500 rounded-2xl ">
        {" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>verify code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="verify code"
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"ghost"}>
              {submit ? (
                <>
                  <Loader2 className="animate-spin" />
                  processing ....
                </>
              ) : (
                <>submit</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
