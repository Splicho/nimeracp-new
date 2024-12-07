"use client";

import { Button } from "@/components/ui/button";
import InputIcon from "@/components/ui/input-icon";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log('Form Data:', { username, password }); // Debug log

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const result = await signIn("credentials", {
        username: username.toString(),
        password: password.toString(),
        redirect: false
      });

      if (result?.error) {
        setError("Invalid username or password");
        return;
      }

      // If login successful, redirect to cabinet
      router.push("/cabinet");
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  }

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <InputIcon 
                icon="ic:baseline-email" 
                placeholder="Username" 
                id="username"
                name="username"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputIcon 
                icon="ic:baseline-lock" 
                placeholder="Password" 
                id="password" 
                name="password"
                type="password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" variant="ringHover">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

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
