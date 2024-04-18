export const ChatIcon = ({ isMobile }) => {
  return (
    <>
      {isMobile ? (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="32"
            height="32"
            rx="16"
            fill="var(--global-color-account_navbar-icon-background)"
          />
          <path
            d="M23.8 12.6531H22.58C21.58 9.9362 18.96 8.125 16 8.125C13.04 8.125 10.42 9.93624 9.42005 12.6531H8.20006C7.54007 12.6531 7 13.1847 7 13.8344V16.1969C7 16.8465 7.54003 17.3782 8.20006 17.3782H9.70005C9.82003 17.3782 9.94001 17.3191 10.0201 17.2207C10.1 17.1222 10.1201 16.9845 10.0801 16.8664C9.88002 16.2757 9.78013 15.6458 9.78013 15.0157C9.78013 14.3856 9.88016 13.7557 10.0801 13.1651C10.9201 10.6253 13.28 8.91258 16 8.91258C18.7201 8.91258 21.08 10.6254 21.9 13.1651C22.1 13.7557 22.1999 14.3856 22.1999 15.0157C22.1999 15.6458 22.0999 16.2757 21.9 16.8664C21.08 19.406 18.72 21.1188 16 21.1188H13.0001C12.2201 21.1188 11.6001 21.7291 11.6001 22.4969C11.6001 23.2647 12.2201 23.875 13.0001 23.875H15C15.78 23.875 16.4 23.2647 16.4 22.4969V21.8866C19.1999 21.7291 21.62 19.977 22.5799 17.3782L23.7999 17.3781C24.4599 17.3781 25 16.8465 25 16.1968V13.8343C25 13.1848 24.46 12.6532 23.7999 12.6532L23.8 12.6531ZM9.18006 16.5906H8.20013C7.98013 16.5906 7.80017 16.4134 7.80017 16.1969L7.80003 13.8343C7.80003 13.6177 7.98 13.4406 8.19999 13.4406H9.18002C9.06005 13.9524 9.00006 14.484 9.00006 15.0156C9.00006 15.5472 9.06005 16.0786 9.18002 16.5906L9.18006 16.5906ZM15.6 22.4968C15.6 22.8315 15.34 23.0875 15 23.0875H13C12.66 23.0875 12.4 22.8315 12.4 22.4968C12.4 22.1621 12.66 21.9061 13 21.9061H15.6V22.4968ZM24.1999 16.1968C24.1999 16.4134 24.02 16.5905 23.8 16.5905H22.82C22.9399 16.0787 22.9999 15.5471 22.9999 15.0155C22.9999 14.4839 22.9399 13.9525 22.82 13.4405H23.7999C24.0199 13.4405 24.1998 13.6176 24.1998 13.8342L24.1999 16.1968ZM20.9999 15.0155C20.9999 12.2986 18.76 10.0937 15.9999 10.0937C13.2399 10.0937 11 12.2986 11 15.0155C11 16.1968 11.42 17.3189 12.2 18.2048L11.1201 19.2679C11.0001 19.386 10.98 19.5435 11.0402 19.701C11.1002 19.8389 11.2402 19.9372 11.4001 19.9372H16.0001C18.7599 19.9374 21 17.7324 21 15.0154L20.9999 15.0155ZM13.04 17.9292C12.24 17.1418 11.8 16.118 11.8 15.0155C11.8 12.7317 13.68 10.8812 16 10.8812C18.32 10.8812 20.1999 12.7318 20.1999 15.0155C20.1999 17.2992 18.3199 19.1499 16 19.1499H12.3596L13.0196 18.5002C13.1797 18.3427 13.1797 18.0867 13.0397 17.9292L13.04 17.9292ZM15.5999 15.0155C15.5999 14.7989 15.7799 14.6218 15.9999 14.6218C16.2199 14.6218 16.3999 14.799 16.3999 15.0155C16.3999 15.2321 16.2199 15.4092 15.9999 15.4092C15.7799 15.4092 15.5999 15.2321 15.5999 15.0155ZM17.5999 15.0155C17.5999 14.7989 17.7799 14.6218 17.9999 14.6218C18.2199 14.6218 18.3998 14.799 18.3998 15.0155C18.3998 15.2321 18.2199 15.4092 17.9999 15.4092C17.7799 15.4092 17.5999 15.2321 17.5999 15.0155ZM13.6 15.0155C13.6 14.7989 13.7799 14.6218 13.9999 14.6218C14.2199 14.6218 14.3999 14.799 14.3999 15.0155C14.3999 15.2321 14.2199 15.4092 13.9999 15.4092C13.7799 15.4092 13.6 15.2321 13.6 15.0155Z"
            fill="var(--global-color-account_navbar-icon)"
          />
        </svg>
      ) : (
        <svg
          width="31"
          height="30"
          viewBox="0 0 31 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="15.5"
            cy="15"
            r="15"
            fill="var(--global-color-sidebar-chat_icon-background)"
          />
          <path
            d="M23.4999 11.5671H22.2487C21.223 8.7805 18.5359 6.92285 15.5 6.92285C12.4641 6.92285 9.77697 8.78053 8.75133 11.5671H7.50006C6.82314 11.5671 6.26923 12.1123 6.26923 12.7787V15.2017C6.26923 15.868 6.8231 16.4133 7.50006 16.4133H9.03851C9.16156 16.4133 9.28462 16.3527 9.36675 16.2517C9.44873 16.1507 9.46934 16.0095 9.42827 15.8883C9.22309 15.2825 9.12064 14.6365 9.12064 13.9902C9.12064 13.344 9.22323 12.6979 9.42827 12.0921C10.2898 9.48728 12.7102 7.73063 15.5 7.73063C18.2898 7.73063 20.7102 9.48731 21.5513 12.0921C21.7564 12.6979 21.8589 13.344 21.8589 13.9902C21.8589 14.6365 21.7563 15.2825 21.5513 15.8883C20.7102 18.4931 18.2898 20.2499 15.5 20.2499H12.4231C11.6231 20.2499 10.9873 20.8758 10.9873 21.6633C10.9873 22.4508 11.6231 23.0767 12.4231 23.0767H14.4744C15.2744 23.0767 15.9102 22.4508 15.9102 21.6633V21.0374C18.7819 20.8758 21.264 19.0787 22.2487 16.4133L23.4999 16.4132C24.1768 16.4132 24.7308 15.868 24.7308 15.2016V12.7786C24.7308 12.1123 24.1769 11.5671 23.4999 11.5671L23.4999 11.5671ZM8.50518 15.6055H7.50013C7.27449 15.6055 7.08992 15.4238 7.08992 15.2017L7.08977 12.7785C7.08977 12.5564 7.27435 12.3747 7.49999 12.3747H8.50515C8.38209 12.8997 8.32057 13.4449 8.32057 13.9901C8.32057 14.5353 8.38209 15.0804 8.50515 15.6055L8.50518 15.6055ZM15.0897 21.6632C15.0897 22.0064 14.823 22.269 14.4743 22.269H12.4231C12.0744 22.269 11.8076 22.0064 11.8076 21.6632C11.8076 21.3199 12.0744 21.0574 12.4231 21.0574H15.0897V21.6632ZM23.9102 15.2017C23.9102 15.4238 23.7256 15.6055 23.5 15.6055H22.4948C22.6179 15.0805 22.6794 14.5353 22.6794 13.99C22.6794 13.4448 22.6179 12.8997 22.4948 12.3746H23.4999C23.7255 12.3746 23.9101 12.5563 23.9101 12.7784L23.9102 15.2017ZM20.6281 13.99C20.6281 11.2035 18.3307 8.942 15.4999 8.942C12.6691 8.942 10.3718 11.2035 10.3718 13.99C10.3718 15.2017 10.8026 16.3525 11.6026 17.2611L10.495 18.3515C10.3719 18.4726 10.3513 18.6341 10.413 18.7957C10.4745 18.9371 10.6182 19.0379 10.7821 19.0379H15.5001C18.3307 19.0381 20.6282 16.7766 20.6282 13.9899L20.6281 13.99ZM12.4641 16.9785C11.6436 16.1708 11.1923 15.1208 11.1923 13.99C11.1923 11.6477 13.1205 9.74969 15.5 9.74969C17.8795 9.74969 19.8076 11.6478 19.8076 13.99C19.8076 16.3323 17.8794 18.2304 15.5 18.2304H11.7663L12.4432 17.5641C12.6073 17.4025 12.6073 17.14 12.4638 16.9784L12.4641 16.9785ZM15.0897 13.99C15.0897 13.7679 15.2743 13.5862 15.4999 13.5862C15.7255 13.5862 15.9101 13.7679 15.9101 13.99C15.9101 14.2122 15.7255 14.3939 15.4999 14.3939C15.2743 14.3939 15.0897 14.2122 15.0897 13.99ZM17.1409 13.99C17.1409 13.7679 17.3255 13.5862 17.5512 13.5862C17.7768 13.5862 17.9614 13.7679 17.9614 13.99C17.9614 14.2122 17.7768 14.3939 17.5512 14.3939C17.3255 14.3939 17.1409 14.2122 17.1409 13.99ZM13.0384 13.99C13.0384 13.7679 13.223 13.5862 13.4486 13.5862C13.6743 13.5862 13.8588 13.7679 13.8588 13.99C13.8588 14.2122 13.6743 14.3939 13.4486 14.3939C13.223 14.3939 13.0384 14.2122 13.0384 13.99Z"
            fill="var(--global-color-account_navbar-icon)"
          />
        </svg>
      )}
    </>
  );
};
