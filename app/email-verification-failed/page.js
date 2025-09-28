// /app/email-verification-failed/page.js
import { Suspense } from "react";
import EmailVerificationFailedPage from "./EmailVerificationFailedPage";

export default function PageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EmailVerificationFailedPage />
    </Suspense>
  );
}
