"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between mx-10 lg:my-5 my-10">
      <div className="font-extrabold lg:text-[1.5vw] text-[5vw]">
        <Link href="/#">Mystery Message</Link>
      </div>
      {session?.user ? (
        <div className="gap-5 flex items-center">
          <p className="lg:block hidden">{session.user.email}</p>
          <Button variant={"ghost"} onClick={() => signOut()}>
            {" "}
            logOUt
          </Button>
        </div>
      ) : (
        <div>
          <Button variant={"ghost"}>
            {" "}
            <Link href="/sign-in">Log In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
