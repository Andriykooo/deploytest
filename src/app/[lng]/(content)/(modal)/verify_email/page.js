import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import VerifyEmail from "@/screens/SignUp/verifyEmail";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <VerifyEmail />
    </ProtectedLayout>
  );
}
