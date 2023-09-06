"use client";
import { images } from "@/utils/imagesConstant";
import "./CustomerServiceNotive.css";
import Image from "next/image";

export const CustomerServiceNotice = () => {
  return (
    <div className="customer-service-notice-wrapper">
      <div className="customer-service-notice">
        <Image
          src={images.GroupSwifty}
          alt="logo"
          className="customer-service-notice-logo"
        />
        <h1 className="customer-service-notice-title">
          Customer Service Notice
        </h1>
        <p className="customer-service-notice-subtitle">
          Thank you for visiting Swifty Gaming.
          <br /> This site blocks access from users accessing from certain
          territories.
        </p>
        <p className="customer-service-notice-description">
          Our monitoring software has detected your IP is from a restricted
          country so you are unable to access the site. If this is incorrect or
          you require further information, please contact
        </p>
        <a
          href="mailto:customer.services@swiftygaming.com"
          className="customer-service-notice-email"
        >
          customer.services@swiftygaming.com
        </a>
        <p className="customer-service-notice-description">
          We apologize for any inconvenience that this may have caused.
        </p>
      </div>
    </div>
  );
};
