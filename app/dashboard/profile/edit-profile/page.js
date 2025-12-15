// "use client";

// import axios from "axios";
// import { AlertCircle, Clock, Edit, ImageIcon } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const API = process.env.NEXT_PUBLIC_API_BASE;

// export default function UserProfilePage() {
//   const [user, setUser] = useState(null);
//   const [edit, setEdit] = useState(false);
//   const [form, setForm] = useState({});
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Load user data
//   useEffect(() => {
//     if (!token) return;

//     axios
//       .get(`${API}/getme`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const u = res.data.user || res.data.data || res.data;
//         setUser(u);
//         setForm({
//           ...u,
//           nominee: u.nominee || {
//             firstName: "",
//             lastName: "",
//             relation: "",
//             phone: "",
//             address: "",
//           },
//         });
//       })
//       .catch(() => alert("Failed to load profile"));
//   }, [token]);

//   const submitRequest = async () => {
//     try {
//         const payload = {
//             firstName: form.firstName || "",
//             lastName: form.lastName || "",
//             phone: form.phone || "",
//             address: form.address || "",
//             image: form.image || "",
//             nominee: {
//                 firstName: form.nominee?.firstName || "",
//                 lastName: form.nominee?.lastName || "",
//                 relation: form.nominee?.relation || "",
//                 phone: form.nominee?.phone || "",
//                 address: form.nominee?.address || "",
//             },
//         };


//         await axios.put(`${API}/requestprofileupdate`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//         });

//         alert("Profile update request sent for admin approval");
//         setEdit(false);
//     } catch (err) {
//         console.error(err.response?.data || err);
//         alert(err?.response?.data?.message || "Failed to submit request");
//     }
// };


//   if (!user) return <div className="text-center py-20">Loading...</div>;

//   // ✅ Pending logic: only if pendingProfileUpdate exists AND status is pending
//   const pending =
//   user.pendingProfileUpdate &&
//   user.pendingProfileUpdate.status === "pending" &&
//   user.pendingProfileUpdate.data &&
//   Object.keys(user.pendingProfileUpdate.data).length > 0;


//   const rejected =
//     user.pendingProfileUpdate &&
//     user.pendingProfileUpdate.status === "rejected";

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

//       {/* STATUS MESSAGES */}
//       {pending && (
//         <div className="mb-6 p-4 rounded-xl bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 flex items-center gap-3">
//           <Clock size={20} /> Your profile update is pending admin approval
//         </div>
//       )}

//       {rejected && (
//         <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-400 text-red-800 flex items-center gap-3">
//           <AlertCircle size={20} /> Rejected: {user.pendingProfileUpdate.rejectReason}
//         </div>
//       )}

//       {/* PROFILE CARD */}
//       <div className="bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* IMAGE */}
//         <div className="flex flex-col items-center md:items-start gap-4">
//           {form.image ? (
//             <Image
//               src={form.image}
//               alt={`${form.firstName || "User"} profile`}
//               width={120}
//               height={120}
//               className="rounded-full object-cover border-2 border-gray-200 shadow"
//             />
//           ) : (
//             <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow">
//               <ImageIcon size={36} />
//             </div>
//           )}
//           <p className="text-lg font-medium text-gray-700">{`${form.firstName || ""} ${form.lastName || ""}`}</p>
//           <p className="text-sm text-gray-500">{form.phone}</p>
//         </div>

//         {/* FORM */}
//         <div className="flex flex-col gap-4">
//           <input
//             disabled={!edit || pending}
//             value={form.firstName || ""}
//             onChange={(e) => setForm({ ...form, firstName: e.target.value })}
//             placeholder="First Name"
//             className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//           <input
//             disabled={!edit || pending}
//             value={form.lastName || ""}
//             onChange={(e) => setForm({ ...form, lastName: e.target.value })}
//             placeholder="Last Name"
//             className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//           <input
//             disabled={!edit || pending}
//             value={form.phone || ""}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             placeholder="Phone"
//             className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//           <input
//             disabled={!edit || pending}
//             value={form.address || ""}
//             onChange={(e) => setForm({ ...form, address: e.target.value })}
//             placeholder="Address"
//             className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//           <input
//             disabled={!edit || pending}
//             value={form.image || ""}
//             onChange={(e) => setForm({ ...form, image: e.target.value })}
//             placeholder="Profile Image URL"
//             className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />

//           {/* Nominee */}
//           <div className="mt-4 border-t pt-4">
//             <h2 className="font-semibold text-lg text-gray-700 mb-2">Nominee Information</h2>
//             <input
//               disabled={!edit || pending}
//               value={form.nominee.firstName || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   nominee: { ...form.nominee, firstName: e.target.value },
//                 })
//               }
//               placeholder="Nominee First Name"
//               className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//             <input
//               disabled={!edit || pending}
//               value={form.nominee.lastName || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   nominee: { ...form.nominee, lastName: e.target.value },
//                 })
//               }
//               placeholder="Nominee Last Name"
//               className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//             <input
//               disabled={!edit || pending}
//               value={form.nominee.relation || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   nominee: { ...form.nominee, relation: e.target.value },
//                 })
//               }
//               placeholder="Nominee Relation"
//               className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//             <input
//               disabled={!edit || pending}
//               value={form.nominee.phone || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   nominee: { ...form.nominee, phone: e.target.value },
//                 })
//               }
//               placeholder="Nominee Phone"
//               className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//             <input
//               disabled={!edit || pending}
//               value={form.nominee.address || ""}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   nominee: { ...form.nominee, address: e.target.value },
//                 })
//               }
//               placeholder="Nominee Address"
//               className="input-field border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ACTION BUTTONS */}
//       {!pending && (
//         <div className="mt-6 flex gap-3">
//           {!edit ? (
//             <button
//               onClick={() => setEdit(true)}
//               className="btn-primary flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               <Edit size={18} /> Edit Profile
//             </button>
//           ) : (
//             <button
//               onClick={submitRequest}
//               className="btn-success bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//             >
//               Submit for Approval
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }























"use client";

import axios from "axios";
import { AlertCircle, Clock, Edit, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  // image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ================= LOAD USER =================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/getme`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data.user || res.data.data || res.data;

        setUser(u);
        setForm({
          ...u,
          nominee: u.nominee || {
            firstName: "",
            lastName: "",
            relation: "",
            phone: "",
            address: "",
          },
        });
      })
      .catch(() => alert("Failed to load profile"));
  }, [token]);

  // ================= IMAGE SELECT =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT REQUEST =================
  const submitRequest = async () => {
    try {
      const formData = new FormData();

      formData.append("firstName", form.firstName || "");
      formData.append("lastName", form.lastName || "");
      formData.append("phone", form.phone || "");
      formData.append("address", form.address || "");

      formData.append(
        "nominee",
        JSON.stringify({
          firstName: form.nominee?.firstName || "",
          lastName: form.nominee?.lastName || "",
          relation: form.nominee?.relation || "",
          phone: form.nominee?.phone || "",
          address: form.nominee?.address || "",
        })
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`${API}/requestprofileupdate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      alert("Profile update request sent for admin approval");
      setEdit(false);
      setUploadProgress(0);
      setImageFile(null);
      setImagePreview(null);

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to submit request");
    }
  };

  if (!user) return <div className="text-center py-20">Loading...</div>;

  // ================= STATUS LOGIC =================
  const pending =
    user.pendingProfileUpdate &&
    user.pendingProfileUpdate.status === "pending" &&
    user.pendingProfileUpdate.data &&
    Object.keys(user.pendingProfileUpdate.data).length > 0;

  const rejected =
    user.pendingProfileUpdate &&
    user.pendingProfileUpdate.status === "rejected";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      {/* STATUS MESSAGES */}
      {pending && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 flex items-center gap-3">
          <Clock size={20} /> Your profile update is pending admin approval
        </div>
      )}

      {rejected && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-400 text-red-800 flex items-center gap-3">
          <AlertCircle size={20} /> Rejected:{" "}
          {user.pendingProfileUpdate.rejectReason}
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center md:items-start gap-4">
          {imagePreview || form.image ? (
            <Image
              src={imagePreview || form.image}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full object-cover border-2 border-gray-200 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow">
              <ImageIcon size={36} />
            </div>
          )}

          {edit && !pending && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </>
          )}

          <p className="text-lg font-medium text-gray-700">
            {form.firstName} {form.lastName}
          </p>
          <p className="text-sm text-gray-500">{form.phone}</p>
        </div>

        {/* FORM SECTION */}
        <div className="flex flex-col gap-4">
          <input
            disabled={!edit || pending}
            value={form.firstName || ""}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            placeholder="First Name"
            className="border rounded-lg px-4 py-2"
          />

          <input
            disabled={!edit || pending}
            value={form.lastName || ""}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            placeholder="Last Name"
            className="border rounded-lg px-4 py-2"
          />

          <input
            disabled={!edit || pending}
            value={form.phone || ""}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            placeholder="Phone"
            className="border rounded-lg px-4 py-2"
          />

          <input
            disabled={!edit || pending}
            value={form.address || ""}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            placeholder="Address"
            className="border rounded-lg px-4 py-2"
          />

          {/* NOMINEE */}
          <div className="mt-4 border-t pt-4">
            <h2 className="font-semibold mb-2">Nominee Information</h2>

            {["firstName", "lastName", "relation", "phone", "address"].map(
              (field) => (
                <input
                  key={field}
                  disabled={!edit || pending}
                  value={form.nominee?.[field] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nominee: {
                        ...form.nominee,
                        [field]: e.target.value,
                      },
                    })
                  }
                  placeholder={`Nominee ${field}`}
                  className="border rounded-lg px-4 py-2 mb-2 w-full"
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {!pending && (
        <div className="mt-6">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit size={18} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={submitRequest}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Submit for Approval
            </button>
          )}
        </div>
      )}
    </div>
  );
}
