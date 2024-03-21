import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import { Verification } from "@/screens/Kyc/Verification";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <Verification />
    </ProtectedLayout>
  );
}
