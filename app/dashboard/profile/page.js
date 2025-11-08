"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getReferrerInfo } from "../../utils/getReferrer";



export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const referrer = getReferrerInfo(user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // অথবা তোমার auth system
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/getprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-10 px-4 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Profile Header */}
      <Card className="p-6 shadow-xl rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <Image
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            width={120}
            height={120}
            className="w-28 h-28 rounded-full border-4 border-gray-700 object-cover"
          />

          {/* Name + Email + Phone */}
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-300">{user.email}</p>
            <p className="text-gray-400 mt-1">📞 {user.phone}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Address & Status */}
        <Card className="p-6 shadow-md rounded-2xl">
          <h3 className="text-xl font-semibold mb-3">Personal Info</h3>
          <Separator className="mb-3" />
          <p><span className="font-medium">Address:</span> {user.address}</p>
          <p><span className="font-medium">Status:</span> {user.status}</p>
          <p><span className="font-medium">Role:</span> {user.role}</p>
          <p><span className="font-medium">Referral Code:</span> {user.referralCode}</p>
          <p><span className="font-medium">Level:</span> {user.level}</p>
        </Card>

        {/* Referral Info */}
        <Card className="p-6 shadow-md rounded-2xl">
          <h3 className="text-xl font-semibold mb-3">Referral Info</h3>
          <Separator className="mb-3" />
          <p><span className="font-medium">Referred By:</span> {user.referredBy || "N/A"}</p>
          <p><span className="font-medium">Referral Placement:</span> {user.placementPosition || "N/A"}</p>
          <p><span className="font-medium">Referrer&apos;s Name:</span> {referrer.name}</p>
          <p><span className="font-medium">Referrer&apos;s Level:</span> {referrer.level}</p>
          <p><span className="font-medium">Referrer&apos;s Email:</span> {referrer.email}</p>
          <p><span className="font-medium">Referrer&apos;s Phone:</span> {referrer.phone}</p>
          
        </Card>
      </div>

      {/* Nominee Info */}
      {user.nominee && (
        <Card className="p-6 mt-8 shadow-md rounded-2xl">
          <h3 className="text-xl font-semibold mb-3">Nominee Information</h3>
          <Separator className="mb-3" />
          <p><span className="font-medium">Name:</span> {user.nominee.firstName} {user.nominee.lastName}</p>
          <p><span className="font-medium">Relation:</span> {user.nominee.relation}</p>
          <p><span className="font-medium">Phone:</span> {user.nominee.phone}</p>
          <p><span className="font-medium">Address:</span> {user.nominee.address}</p>
        </Card>
      )}
    </motion.div>
  );
}







