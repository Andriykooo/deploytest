import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import { VerifyPhone } from "@/screens/SignUp/VerifyPhone";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <VerifyPhone />
    </ProtectedLayout>
  );
}
