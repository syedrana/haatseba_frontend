"use client";

import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RegisterForm />
    </Suspense>
  );
}
