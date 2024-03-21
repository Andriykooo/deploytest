import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import Kyc from "@/screens/Kyc/Kyc";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <Kyc />
    </ProtectedLayout>
  );
}
