"use client";

import { Button } from "@/components/ui/button";
import InputIcon from "@/components/ui/input-icon";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-[#E9E9E9] dark:bg-[#121212] p-20">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <Image 
              src="/logo/nimera_Logomark.svg"
              alt="Logo"
              width={100}
              height={100}
            />
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
              <p className="text-gray-500">
                {isLogin
                  ? "Enter your credentials to login"
                  : "Create an account to get started"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <InputIcon icon="ic:baseline-person" placeholder="John Doe" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <InputIcon icon="ic:baseline-email" placeholder="Username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputIcon icon="ic:baseline-lock" placeholder="Password" />
            </div>
          </div>

          <Button className="w-full" variant="ringHover">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>


          <p className="text-sm text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link href={isLogin ? "/register" : "/"}>
              <Button
                className="font-semibold"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? "Register" : "Login"}
              </Button>
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 relative">
        <Image
          src="/background/draenei.jpg"
          alt="Authentication background"
          className="w-full h-full object-cover"
          fill
          quality={100}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}
