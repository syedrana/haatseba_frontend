"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Banknote, Building2, FileText, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { use, useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function VendorRequestDetailPage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const { id } = use(params);

  // useEffect(() => {
  //   const fetchRequest = async () => {
  //     try {
  //       const { data } = await axios.get(`${API_BASE}/vendor/requests/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setData((data.request));
  //     } catch (error) {
  //       console.error("Error loading vendor request:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchRequest();
  // }, [id]);



  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/vendor/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.request);
    } catch (error) {
      console.error("Error loading vendor request:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this vendor?")) return;

    try {
      const { data: result } = await axios.put(`${API_BASE}/approvevendorrequest/${id}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (result.success) {
        alert("✅ Vendor approved successfully!");
        fetchData();
      } else {
        alert("❌ Failed to approve vendor.");
      }
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const handleReject = async () => {
    if (!adminNote.trim()) {
      alert("Please add a rejection note.");
      return;
    }

    try {
      const { data: result } = await axios.put(`${API_BASE}/rejectvendorrequest/${id}`,{adminNote}, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (result.success) {
        alert("❌ Vendor rejected successfully!");
        setOpenRejectModal(false);
        setAdminNote("");
        fetchData();
      } else {
        alert("Failed to reject vendor.");
      }
    } catch (error) {
      console.error("Reject error:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-gray-500 mt-10">No vendor request found.</div>;
  }

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-600 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Vendor Request Details
          </h1>
          <p className="text-gray-500 text-sm">Request ID: {data._id}</p>
        </div>
        <Badge
          className={`px-4 py-2 text-sm font-semibold border ${statusColors[data.status]}`}
        >
          {data.status.toUpperCase()}
        </Badge>
      </div>

      

      {/* Action Buttons */}
      {data.status === "pending" && (
        <div className="flex gap-3">
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-5"
          >
            Approve
          </Button>
          <Button
            onClick={() => setOpenRejectModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5"
          >
            Reject
          </Button>
        </div>
      )}

      {/* User Info */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={data.userId?.image}
              alt="User"
              width={60}
              height={60}
              className="rounded-full border shadow-sm"
            />
            <div>
              <p className="font-semibold">
                {data.userId?.firstName} {data.userId?.lastName}
              </p>
              <p className="text-sm text-gray-500">{data.userId?.email}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2">
            <Phone className="w-4 h-4 text-gray-400" /> {data.userId?.phone}
          </div>
        </CardContent>
      </Card>

      {/* Business Info */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <InfoItem icon={<MapPin />} label="Address" value={data.businessAddress} />
          <InfoItem icon={<FileText />} label="Trade License" value={data.tradeLicenseNumber} />
          <InfoItem icon={<Phone />} label="Business Phone" value={data.businessPhone} />
          <InfoItem icon={<Mail />} label="Business Email" value={data.businessEmail} />
          <InfoItem icon={<Building2 />} label="Business Name" value={data.businessName} />
        </CardContent>
      </Card>

      {/* Bank Info */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-500" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <InfoItem label="Account Name" value={data.bankAccount?.accountName} />
          <InfoItem label="Account Number" value={data.bankAccount?.accountNumber} />
          <InfoItem label="Bank Name" value={data.bankAccount?.bankName} />
          <InfoItem label="Branch Name" value={data.bankAccount?.branchName} />
          <InfoItem label="Bkash Number" value={data.bankAccount?.bkashNumber} />
          <InfoItem label="Nagad Number" value={data.bankAccount?.nagadNumber} />
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.documents.map((doc, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:shadow-md transition"
              >
                <Image
                  src={doc}
                  alt={`Document ${index + 1}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Info */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Admin Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <InfoItem label="Reviewed By" value={data.reviewedBy?.name || "Not reviewed yet"} />
          <InfoItem
            label="Reviewed At"
            value={
              data.reviewedAt
                ? new Date(data.reviewedAt).toLocaleString()
                : "Not yet reviewed"
            }
          />
          <InfoItem label="Admin Note" value={data.adminNote || "No comment"} />
        </CardContent>
      </Card>

      {/* Reject Modal */}
      <Dialog open={openRejectModal} onOpenChange={setOpenRejectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Vendor Request</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Add your rejection note..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRejectModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </span>
      <span className="text-gray-800 dark:text-gray-200 font-medium">{value || "—"}</span>
    </div>
  );
}

