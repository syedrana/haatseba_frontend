import { Suspense } from "react";
import RegisterWizard from "./RegisterWizard";

export default function RegistrationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterWizard />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-gray-500 text-lg">Loading registration...</p>
    </div>
  );
}
