"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import InputIcon from "@/components/ui/input-icon";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { registerAccount } from "@/actions/register";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await registerAccount(username, email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Registration successful, redirect to login
        router.push('/?registered=true');
      }
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-[#E9E9E9] dark:bg-[#121212] p-20">
        <form onSubmit={onSubmit} className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <Image 
              src="/logo/nimera_Logomark.svg"
              alt="Logo"
              width={100}
              height={100}
            />
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-gray-500">
                Create a master account to get started
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <InputIcon 
                name="username"
                icon="ic:baseline-person" 
                placeholder="Username" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <InputIcon 
                name="email"
                type="email"
                icon="ic:baseline-email" 
                placeholder="example@example.com" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputIcon 
                name="password"
                type="password"
                icon="ic:baseline-lock" 
                placeholder="Password" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputIcon 
                name="confirmPassword"
                type="password"
                icon="ic:baseline-lock" 
                placeholder="Confirm Password" 
                required
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full" 
            variant="ringHover"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="text-blue-600 hover:underline font-medium">
              <Button variant="link">Login</Button>
            </Link>
          </p>
        </form>
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
