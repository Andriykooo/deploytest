import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import FinishAccountSetup from "@/screens/SignUp/FinishAccountSetup";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <FinishAccountSetup />
    </ProtectedLayout>
  );
}
