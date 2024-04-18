import { Number0 } from "./Number0";
import { Number1 } from "./Number1";
import { Number2 } from "./Number2";
import { Number3 } from "./Number3";
import { Number4 } from "./Number4";
import { Number5 } from "./Number5";
import { Number6 } from "./Number6";
import { Number7 } from "./Number7";
import { Number8 } from "./Number8";
import { Number9 } from "./Number9";

export const TrendingNumberIcon = ({ number, isMobile }) => {
  const trendingNumber = {
    number0: <Number0 isMobile={isMobile} />,
    number1: <Number1 isMobile={isMobile} />,
    number2: <Number2 isMobile={isMobile} />,
    number3: <Number3 isMobile={isMobile} />,
    number4: <Number4 isMobile={isMobile} />,
    number5: <Number5 isMobile={isMobile} />,
    number6: <Number6 isMobile={isMobile} />,
    number7: <Number7 isMobile={isMobile} />,
    number8: <Number8 isMobile={isMobile} />,
    number9: <Number9 isMobile={isMobile} />,
  };
  const renderNumbers = () => {
    return number.map((num, index) => {
      const NumberComponent = trendingNumber[`number${num}`];
      if (NumberComponent) {
        return (
          <div key={`number-${num}-${index}`} style={{ marginRight: "1px" }}>
            {NumberComponent}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 2,
        inset: isMobile ? "0 0 0 10px" : "0 0 0 19px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "30px" : "60px",
          height: isMobile ? "30px" : "60px",
          position: "absolute",
        }}
      >
        {renderNumbers()}
      </div>
      <svg
        width={isMobile ? "34" : "68"}
        height={isMobile ? "38" : "74"}
        viewBox="0 0 68 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M59.0657 0V19H68L59.0657 0Z"
          fill="var(--global-color-casino-trending_background)"
        />
        <path
          d="M59.0657 0V19H68L59.0657 0Z"
          fill="url(#paint0_linear_8507_48567)"
          fillOpacity="0.2"
        />
        <g style={{ mixBlendMode: "multiply" }}>
          <path
            d="M59.0657 0V19H68L59.0657 0Z"
            fill="var(--global-color-casino-trending_shade_primary)"
          />
        </g>
        <g style={{ mixBlendMode: "multiply" }}>
          <path
            d="M60.5547 4.86711L58.3212 0H0.992706V55.1275L29.781 74L60.5547 54.3825V4.86711Z"
            fill="var(--global-color-casino-trending_shade_secondary)"
            fillOpacity="0.3"
          />
        </g>
        <path
          d="M59.562 0H0V52.701L29.781 72L59.562 52.701V0Z"
          fill="var(--global-color-casino-trending_background)"
        />
        <path
          d="M59.562 0H0V52.701L29.781 72L59.562 52.701V0Z"
          fill="url(#paint1_linear_8507_48567)"
          fillOpacity="0.2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_8507_48567"
            x1="63.5328"
            y1="0"
            x2="60.3653"
            y2="12.8801"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_8507_48567"
            x1="29.781"
            y1="0"
            x2="22.6841"
            y2="50.7688"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
