"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// ---------- helpers ----------
const bdPhoneOk = (v) => /^01[3-9]\d{8}$/.test(v || "");
const passStrong = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

// ---------- UI: Floating input ----------
const FloatingInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  toggleType,
  error,
  autoComplete,
}) => (
  <div className="relative w-full">
    <input
      type={toggleType || type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      autoComplete={autoComplete}
      className={`peer block w-full rounded-xl border px-3 pt-5 pb-2 text-sm bg-transparent h-14 focus:outline-none focus:ring-2
      ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"}`}
    />
    <label
      htmlFor={name}
      className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-indigo-600"
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ---------- Page ----------
export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    referralCode: "",
    nomineeFirstName: "",
    nomineeLastName: "",
    nomineeRelation: "",
    nomineePhone: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dropRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ----- image handlers -----
  const onPickImage = async (file) => {
    if (!file) return;
    // simple guard: max ~3MB, type check
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      setErrors((p) => ({ ...p, image: "Only JPG, PNG or WEBP allowed" }));
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: "Max 3MB image allowed" }));
      return;
    }
    setErrors((p) => ({ ...p, image: null }));
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const onDrop = (e) => {
    e.preventDefault();
    onPickImage(e.dataTransfer.files?.[0]);
  };

  // ----- validation aligned with model/controller -----
  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Valid email is required";
    if (!bdPhoneOk(form.phone))
      e.phone = "Valid Bangladeshi phone (01[3-9]XXXXXXXX)";
    if (!form.password) e.password = "Password is required";
    if (
      form.password.length < 8 ||
      form.password.length > 16 ||
      !/[A-Z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password) ||
      /^\s|\s$/.test(form.password)
    ) {
      e.password =
        "8–16 chars, 1 uppercase, 1 number, 1 symbol; no leading/trailing space";
    }
    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";
    if (!form.address.trim() || form.address.trim().length < 5)
      e.address = "Address must be at least 5 characters";
    if (!form.nomineeFirstName.trim()) e.nomineeFirstName = "Required";
    if (!form.nomineeLastName.trim()) e.nomineeLastName = "Required";
    if (!form.nomineeRelation.trim()) e.nomineeRelation = "Required";
    if (!bdPhoneOk(form.nomineePhone)) e.nomineePhone = "Valid nominee phone required";
    if (!imgFile) e.image = "User image is required";
    return e;
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const eMap = validate();
  //   if (Object.keys(eMap).length) {
  //     setErrors(eMap);
  //     return;
  //   }
  //   setErrors({});
  //   setSubmitting(true);

  //   try {
  //     // convert image to base64 string for controller
  //     const imageBase64 = await fileToBase64(imgFile);

  //     // build payload exactly like your controller expects
  //     const payload = {
  //       firstName: form.firstName.trim(),
  //       lastName: form.lastName.trim(),
  //       email: form.email.trim().toLowerCase(),
  //       phone: form.phone.trim(),
  //       password: form.password, // controller hashes it
  //       image: imageBase64, // required string (base64)
  //       address: form.address.trim(),
  //       referralCode: form.referralCode?.trim() || "",
  //       nominee: {
  //         firstName: form.nomineeFirstName.trim(),
  //         lastName: form.nomineeLastName.trim(),
  //         relation: form.nomineeRelation.trim(), // should match enum
  //         phone: form.nomineePhone.trim(),
  //       },
  //     };

  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/registration`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: process.env.NEXT_PUBLIC_API_KEY || "", // secureApi middleware
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) {
  //       // common duplicate errors, validation messages from backend
  //       setErrors((p) => ({ ...p, submit: data?.message || "Registration failed" }));
  //     } else {
  //       // success
  //       alert("User registered successfully. Please verify your email.");
  //       // reset
  //       setForm({
  //         firstName: "",
  //         lastName: "",
  //         email: "",
  //         phone: "",
  //         password: "",
  //         confirmPassword: "",
  //         address: "",
  //         referralCode: "",
  //         nomineeFirstName: "",
  //         nomineeLastName: "",
  //         nomineeRelation: "",
  //         nomineePhone: "",
  //       });
  //       setImgFile(null);
  //       setPreview(null);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setErrors((p) => ({ ...p, submit: "Network error. Try again." }));
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const imageBase64 = await fileToBase64(imgFile);

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        image: imageBase64,
        address: form.address.trim(),
        referralCode: form.referralCode?.trim() || "",
        nominee: {
          firstName: form.nomineeFirstName.trim(),
          lastName: form.nomineeLastName.trim(),
          relation: form.nomineeRelation.trim(),
          phone: form.nomineePhone.trim(),
        },
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.warn("❌ Response is not JSON");
      }

      if (!res.ok) {
        const msg = data?.message || `Request failed with status ${res.status}`;
        setErrors((p) => ({ ...p, submit: msg }));
        return;
      }

      alert("User registered successfully. Please verify your email.");

      // reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        referralCode: "",
        nomineeFirstName: "",
        nomineeLastName: "",
        nomineeRelation: "",
        nomineePhone: "",
      });
      setImgFile(null);
      setPreview(null);

    } catch (err) {
      console.error(err);
      setErrors((p) => ({ ...p, submit: "Network error. Try again." }));
    } finally {
      setSubmitting(false);
    }
  };


  const strength = passStrong(form.password);
  const strengthBar = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"][strength - 1] || "bg-gray-200";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Create an Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <FloatingInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <FloatingInput
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
          autoComplete="email"
        />
        <FloatingInput
          label="Phone (BD)"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          error={errors.phone}
          autoComplete="tel"
        />

        {/* Password with toggle */}
        <div className="relative">
          <FloatingInput
            label="Password"
            name="password"
            value={form.password}
            onChange={onChange}
            toggleType={showPw ? "text" : "password"}
            error={errors.password}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label="Toggle password visibility"
          >
            {showPw ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Strength meter */}
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full transition-all ${strengthBar}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>

        {/* Confirm password with toggle */}
        <div className="relative">
          <FloatingInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            toggleType={showCPw ? "text" : "password"}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowCPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label="Toggle confirm password visibility"
          >
            {showCPw ? "🙈" : "👁️"}
          </button>
        </div>

        <FloatingInput
          label="Address"
          name="address"
          value={form.address}
          onChange={onChange}
          error={errors.address}
          autoComplete="street-address"
        />

        <FloatingInput
          label="Referral Code (optional)"
          name="referralCode"
          value={form.referralCode}
          onChange={onChange}
        />

        {/* Drag & Drop Image */}
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`mt-2 p-4 border-2 border-dashed rounded-xl text-center ${
            errors.image ? "border-red-500" : "border-gray-300"
          }`}
        >
          <p className="mb-2">Drag & Drop profile image or click to select</p>
          <input
            id="imageUpload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onPickImage(e.target.files?.[0])}
          />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Select Image
          </label>
          {preview && (
            <div className="mt-3 flex justify-center">
              <Image
                src={preview}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-xl border object-cover"
              />
            </div>
          )}
          {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
        </div>

        {/* Nominee */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Nominee Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput
              label="Nominee First Name"
              name="nomineeFirstName"
              value={form.nomineeFirstName}
              onChange={onChange}
              error={errors.nomineeFirstName}
            />
            <FloatingInput
              label="Nominee Last Name"
              name="nomineeLastName"
              value={form.nomineeLastName}
              onChange={onChange}
              error={errors.nomineeLastName}
            />
          </div>

          {/* Relation should match enum in model */}
          <div className="relative w-full">
            <select
              name="nomineeRelation"
              value={form.nomineeRelation}
              onChange={onChange}
              className={`block w-full rounded-xl border bg-white px-3 py-3 text-sm h-14 focus:outline-none focus:ring-2
              ${errors.nomineeRelation ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"}`}
            >
              <option value="" disabled>
                Select relation
              </option>
              {["Father","Mother","Brother","Sister","Spouse","Child","Relative","Other"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.nomineeRelation && (
              <p className="mt-1 text-xs text-red-500">{errors.nomineeRelation}</p>
            )}
          </div>

          <FloatingInput
            label="Nominee Phone (BD)"
            type="tel"
            name="nomineePhone"
            value={form.nomineePhone}
            onChange={onChange}
            error={errors.nomineePhone}
          />
        </div>

        {errors.submit && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-60"
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}








