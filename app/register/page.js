"use client";

import axios from "axios";
import Image from "next/image";
import { useRef, useState } from "react";

// ---------- Helpers ----------
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

// ---------- Floating Input Component ----------
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

const FloatingSelect = ({ label, name, value, onChange, options, error }) => (
  <div className="relative w-full">
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`peer block w-full rounded-xl border px-3 pt-5 pb-2 text-sm bg-white h-14 focus:outline-none focus:ring-2
        ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"}`}
    >
      <option value="" disabled hidden></option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    {/* floating label */}
    <label
      htmlFor={name}
      className={`absolute left-3 text-gray-500 text-sm transition-all bg-white px-1
        ${!value ? "top-1/2 -translate-y-1/2 text-gray-400 text-sm" : "top-0 -translate-y-1/2 text-indigo-600 text-xs"}
        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-indigo-600`}
    >
      {label}
    </label>

    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ---------- Registration Page ----------
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
    nomineeAddress: "",
    placementPosition: "",
    depositTransactionId: "", // ✅ new field
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dropRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ---------- Image Handlers ----------
  const onPickImage = async (file) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      setErrors((p) => ({ ...p, image: "Only JPG, PNG or WEBP allowed" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: "Max 2MB image allowed" }));
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

  // ---------- Validation ----------
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
    )
      e.password =
        "8–16 chars, 1 uppercase, 1 number, 1 symbol; no leading/trailing space";
    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";
    if (!form.address.trim() || form.address.trim().length < 5)
      e.address = "Address must be at least 5 chars";
    if (!form.nomineeFirstName.trim()) e.nomineeFirstName = "Required";
    if (!form.nomineeLastName.trim()) e.nomineeLastName = "Required";
    if (!form.nomineeRelation.trim()) e.nomineeRelation = "Required";
    if (!bdPhoneOk(form.nomineePhone))
      e.nomineePhone = "Valid nominee phone required";
    if (!form.nomineeAddress.trim())
      e.nomineeAddress = "Nominee address is required";
    if (!form.placementPosition)
      e.placementPosition = "Placement position is required";
    if (!form.depositTransactionId.trim())
      e.depositTransactionId = "Transaction ID is required"; 
    if (!form.referralCode.trim())
      e.referralCode = "Referred code is required";
    if (!imgFile) e.image = "User image is required";
    return e;
  };

  // ---------- Submit ----------
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
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (
          ![
            "nomineeFirstName",
            "nomineeLastName",
            "nomineeRelation",
            "nomineePhone",
            "nomineeAddress",
          ].includes(key)
        ) {
          formData.append(key, val.trim());
        }
      });
      // nominee object
      formData.append("nominee[firstName]", form.nomineeFirstName.trim());
      formData.append("nominee[lastName]", form.nomineeLastName.trim());
      formData.append("nominee[relation]", form.nomineeRelation.trim());
      formData.append("nominee[phone]", form.nomineePhone.trim());
      formData.append("nominee[address]", form.nomineeAddress.trim());

      if (imgFile) formData.append("image", imgFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/registration`,
        formData,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      // Reset form
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
        nomineeAddress: "",
        placementPosition: "",
        depositTransactionId: "",
      });
      setImgFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.response?.data?.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  const strength = passStrong(form.password);
  const strengthBar =
    ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"][
      strength - 1
    ] || "bg-gray-200";

  // ---------- UI ----------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Create an Account
        </h2>

        {/* Payment Info */}
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
          <p>
            Please payment your <strong>registration fee</strong> to the following bKash merchant account:
          </p>
          <p className="text-lg font-semibold mt-1">📱 01XXXXXXXXX</p>
          <p className="mt-1 text-gray-600">
            After payment, enter your <strong>Transaction ID</strong> below.
          </p>
        </div>

        {/* Transaction ID */}
        <FloatingInput
          label="bKash Transaction ID"
          name="depositTransactionId"
          value={form.depositTransactionId}
          onChange={onChange}
          error={errors.depositTransactionId}
        />

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

        {/* Password */}
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
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPw ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full transition-all ${strengthBar}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>

        {/* Confirm Password */}
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
            onClick={() => setShowCPw(!showCPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
          label="Referral Code"
          name="referralCode"
          value={form.referralCode}
          onChange={onChange}
          error={errors.referralCode}
        />

        {/* Placement Position */}
        <FloatingSelect
          label="Placement Position"
          name="placementPosition"
          value={form.placementPosition}
          onChange={onChange}
          options={[
            { value: "line one", label: "Line One" },
            { value: "line two", label: "Line Two" },
            { value: "line three", label: "Line Three" },
          ]}
          error={errors.placementPosition}
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
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Nominee Section */}
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

          <FloatingSelect
            label="Nominee Relation"
            name="nomineeRelation"
            value={form.nomineeRelation}
            onChange={onChange}
            options={[
              { value: "father", label: "Father" },
              { value: "mother", label: "Mother" },
              { value: "brother", label: "Brother" },
              { value: "sister", label: "Sister" },
              { value: "spouse", label: "Spouse" },
              { value: "child", label: "Child" },
              { value: "other", label: "Other" },
            ]}
            error={errors.nomineeRelation}
          />
          <FloatingInput
            label="Nominee Phone (BD)"
            type="tel"
            name="nomineePhone"
            value={form.nomineePhone}
            onChange={onChange}
            error={errors.nomineePhone}
          />
          <FloatingInput
            label="Nominee Address"
            name="nomineeAddress"
            value={form.nomineeAddress}
            onChange={onChange}
            error={errors.nomineeAddress}
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
