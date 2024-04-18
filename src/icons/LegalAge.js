export const LegalAge = ({ text, className }) => {
  return (
    <div className={className}>
      <div style={{ width: 32, height: 33 }}>
        <svg
          width="32"
          height="33"
          viewBox="0 0 32 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="0.5"
            width="32"
            height="32"
            rx="16"
            fill="var(--global-color-notification-alert_error)"
          />
          <path
            d="M21.5577 10.1922C21.0385 10.1922 20.625 10.5781 20.625 11.0651V15.3433C20.625 15.5584 20.4506 15.7328 20.2356 15.7328C20.0205 15.7328 19.8462 15.5584 19.8462 15.3433V8.58423C19.8462 8.10643 19.4231 7.71133 18.9135 7.71133C18.4038 7.71133 17.9808 8.09724 17.9808 8.58423V15.3433C17.9808 15.5584 17.8064 15.7328 17.5913 15.7328C17.3763 15.7328 17.2019 15.5584 17.2019 15.3433V8.37289C17.2019 7.8951 16.7788 7.5 16.2692 7.5C15.7596 7.5 15.3365 7.88591 15.3365 8.37289V15.2905C15.3365 15.5347 15.1385 15.7328 14.8942 15.7328C14.65 15.7328 14.4519 15.5347 14.4519 15.2905V9.69602C14.4519 9.21822 14.0288 8.82312 13.5192 8.82312C13.0096 8.82312 12.5865 9.20904 12.5865 9.69602V17.5084C12.5865 17.7659 12.3777 17.9747 12.1202 17.9747C11.8626 17.9747 11.6538 17.7659 11.6538 17.5084V14.9334C11.6538 14.3821 11.1731 13.9319 10.5769 13.9319C9.98077 13.9319 9.5 14.3821 9.5 14.9334V18.866C9.5 20.4832 10.5 25.1233 16.2115 25.4816C16.3654 25.4908 16.5192 25.5 16.6731 25.5C20.1346 25.5 22.5 22.964 22.5 20.2351V11.0651C22.5 10.5873 22.0673 10.1922 21.5577 10.1922Z"
            fill="var(--global-color-main-icon_primary)"
          />
        </svg>
      </div>
      <span>{text}</span>
      <div style={{ width: 32, height: 33 }}>
        <svg
          width="32"
          height="33"
          viewBox="0 0 32 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            style={{ fillRule: "evenodd", clipRule: "evenodd" }}
            d="M16 32.5C7.16344 32.5 0 25.3366 0 16.5C0 7.66344 7.16344 0.5 16 0.5C24.8366 0.5 32 7.66344 32 16.5C32 25.3366 24.8366 32.5 16 32.5ZM16 30.9C23.9529 30.9 30.4 24.4529 30.4 16.5C30.4 8.5471 23.9529 2.1 16 2.1C8.0471 2.1 1.6 8.5471 1.6 16.5C1.6 24.4529 8.0471 30.9 16 30.9ZM11.1132 12.471H8.18555V13.7294H9.71708V19.936H11.1132V12.471ZM17.8955 14.3692C17.8955 13.7649 17.675 13.2868 17.2339 12.9349C16.7929 12.5829 16.1903 12.407 15.4263 12.407C14.6762 12.407 14.0806 12.5794 13.6395 12.9242C13.1985 13.269 12.9779 13.7329 12.9779 14.3159C12.9779 14.6643 13.0734 14.9806 13.2644 15.265C13.4555 15.5494 13.7211 15.7769 14.0615 15.9475C13.61 16.1111 13.2558 16.3617 12.9988 16.6994C12.7418 17.0371 12.6133 17.4263 12.6133 17.8671C12.6133 18.3008 12.7279 18.6776 12.9571 18.9976C13.1863 19.3175 13.5145 19.5645 13.9417 19.7387C14.3688 19.9129 14.8672 20 15.4367 20C16.0063 20 16.5046 19.9129 16.9318 19.7387C17.359 19.5645 17.6871 19.3139 17.9163 18.9869C18.1456 18.6598 18.2602 18.2795 18.2602 17.8458C18.2602 17.4121 18.1369 17.0282 17.8903 16.6941C17.6437 16.3599 17.3051 16.1111 16.8745 15.9475C17.194 15.7911 17.444 15.5743 17.6246 15.297C17.8052 15.0197 17.8955 14.7105 17.8955 14.3692ZM14.1553 14.4439C14.1553 14.124 14.2681 13.8752 14.4939 13.6974C14.7196 13.5197 15.0339 13.4308 15.4368 13.4308C15.8396 13.4308 16.1522 13.5197 16.3744 13.6974C16.5967 13.8752 16.7078 14.124 16.7078 14.4439C16.7078 14.7639 16.5967 15.0127 16.3744 15.1904C16.1522 15.3682 15.8396 15.457 15.4368 15.457C15.0339 15.457 14.7196 15.3682 14.4939 15.1904C14.2681 15.0127 14.1553 14.7639 14.1553 14.4439ZM13.9258 17.7071C13.9258 17.3446 14.0577 17.0637 14.3217 16.8647C14.5856 16.6656 14.9537 16.5661 15.4261 16.5661C15.9053 16.5661 16.2786 16.6674 16.5461 16.87C16.8135 17.0726 16.9472 17.3552 16.9472 17.7178C16.9472 18.0875 16.8135 18.3737 16.5461 18.5763C16.2786 18.7789 15.9088 18.8802 15.4365 18.8802C14.9572 18.8802 14.5856 18.7771 14.3217 18.571C14.0577 18.3648 13.9258 18.0768 13.9258 17.7071ZM23.6053 16.95V15.9902H21.7925V14.1453H20.9069V15.9902H19.1045V16.95H20.9069V18.7843H21.7925V16.95H23.6053Z"
            fill="var(--global-color-main-icon_primary)"
          />
        </svg>
      </div>
    </div>
  );
};