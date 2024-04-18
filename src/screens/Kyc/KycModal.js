import { ReminderIcon } from "@/icons/ReminderIcon";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "../../components/button/Button";
import { useCustomRouter } from "@/hooks/useCustomRouter";

const KycModal = () => {
  const t = useTranslations();
  const router = useCustomRouter();

  return (
    <div className="loginForm kycModal">
      <ReminderIcon />

      <h3>{t("kyc.already_verified")}</h3>
      <p>{t("kyc.verified_no_required_steps")}</p>

      <Button
        className={"btnPrimary continueBtn validBtn"}
        onClick={() => {
          router.push("/");
        }}
        text={t("kyc.return_home_page")}
      />
    </div>
  );
};

export default KycModal;
