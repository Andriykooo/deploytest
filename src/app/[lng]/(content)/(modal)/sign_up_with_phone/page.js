import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import SignUpWithPhone from "@/screens/SignUp/SignUpWithPhone";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <SignUpWithPhone />
    </ProtectedLayout>
  );
}
