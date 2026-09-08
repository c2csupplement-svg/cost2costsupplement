"use client"


import WhyC2C from "@/components/home/WhyC2C";
import AccountPage from "@/components/account/AccountPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Blogs() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token){
      router.push("/login")
    }
  })

  return (
    <main className="min-h-screen">

      <AccountPage />
      <WhyC2C />
    </main>
  );
}