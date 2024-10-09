"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import apiResponse from "@/type/apiResponse";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [usernameResponse, setUsernameResaponse] = useState("");
  const debounced = useDebounceCallback(setUsername, 500);
  const [submit, setSubmit] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function usernameUniqeCheeck() {
      if (username) {
        setUsernameResaponse("");
        console.log(username);
        try {
          const response = await axios.get(
            `/api/username-uniqe-cheeck?username=${username}`
          );
          setUsernameResaponse(response.data.message);
        } catch (error) {
          const axioserror = error as AxiosError<apiResponse>;
          setUsernameResaponse(
            axioserror.response?.data.message ?? "error cheech username"
          );
        }
      }
    }
    usernameUniqeCheeck();
  }, [username]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setSubmit(true);
      const response = await axios.post("/api/sign-Up", values);
      toast({
        title: "SignUp successfully done...",
        description: response.data.message,
      });
      router.replace(`verify/${username}`);
    } catch {
      console.log("axios problem");

      toast({
        title: "SignUp fail.",
      });
    } finally {
      setSubmit(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-500 rounded-2xl shadow-md ">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    className="rounded-2xl"
                    placeholder="Username"
                  />
                  <p
                    className={`${
                      usernameResponse === "Username id unique"
                        ? "text-green-950"
                        : "text-red-700"
                    } font-bold`}
                  >
                    {usernameResponse}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    name="email"
                    className="rounded-2xl"
                    placeholder="Email"
                  />
                  <p className="text-muted text-gray-400 text-sm">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    name="password"
                    className="rounded-2xl"
                    placeholder="password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {submit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
