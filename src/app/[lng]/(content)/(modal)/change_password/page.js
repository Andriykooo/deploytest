import { ProtectedLayout } from "@/layouts/protectedLayout/ProtectedLayout";
import { ChangePassword } from "@/screens/ChangePassword/ChangePassword";

export default function Page() {
  return (
    <ProtectedLayout redirect="/login">
      <ChangePassword />
    </ProtectedLayout>
  );
}
