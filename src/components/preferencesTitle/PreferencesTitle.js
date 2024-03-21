import React from "react";
import classNames from "classnames";
import ProfileBack from "../profileBack/ProfileBack";

import './PreferencesTitle.css';

const PreferencesTitle = ({
  title,
  backRoute,
  showBack = true,
  marginBottomSize = 'md',
  showBackOnDesktop = false,
}) => {
  return (
    <>
      {showBack && (
        <ProfileBack
          showOnDesktop={showBackOnDesktop}
          back={backRoute}
        />
      )}
      <p
        className={classNames('preferencesTitle', `preferencesTitle-margin-${marginBottomSize}`, {
          'preferencesTitle-arrowVisible': showBackOnDesktop,
        })}
      >
        {title}
      </p>
    </>
  );
};

export default PreferencesTitle;
