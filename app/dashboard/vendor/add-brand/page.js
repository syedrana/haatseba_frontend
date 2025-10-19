"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// ✅ Validation Schema
const formSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export default function AdminAddBrandPage() {
  const { toast } = useToast();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  // 🪄 Submit Handler
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/createbrand`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "✅ Brand Created",
        description: `Brand "${data.name}" has been added successfully.`,
      });
      reset();
    } catch (err) {
      toast({
        title: "❌ Error",
        description:
          err.response?.data?.message || "Failed to add brand. Try again!",
      });
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="shadow-2xl border-t-4 border-purple-600 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-700">
            🏷️ Add New Brand
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Floating Name Input */}
            <div className="relative">
              <Input
                placeholder=" "
                {...register("name")}
                className="peer focus:border-purple-600 focus:ring-purple-500"
              />
              <Label className="floating-label">Brand Name</Label>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Floating Description Textarea */}
            <div className="relative">
              <Textarea
                placeholder=" "
                rows={4}
                {...register("description")}
                className="peer focus:border-purple-600 focus:ring-purple-500"
              />
              <Label className="floating-label">Description</Label>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Submitting..." : "Add Brand"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Floating Label CSS */}
      <style jsx>{`
        .floating-label {
          position: absolute;
          top: -10px;
          left: 10px;
          background: white;
          padding: 0 6px;
          color: #6b7280;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .peer::placeholder-shown + .floating-label {
          top: 12px;
          font-size: 1rem;
          color: #9ca3af;
        }
      `}</style>
    </motion.div>
  );
}
