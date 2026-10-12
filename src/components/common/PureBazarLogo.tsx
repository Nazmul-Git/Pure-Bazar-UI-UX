import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PureBazarLogo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-base' },
    md: { icon: 34, text: 'text-xl' },
    lg: { icon: 42, text: 'text-2xl' },
    xl: { icon: 56, text: 'text-3xl' },
  };

  const { icon: iconDim, text: textSize } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* High-fidelity SVG recreating the user's PureBazar brand symbol */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconDim}
          height={iconDim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform -rotate-6 transition-transform hover:rotate-0 duration-300"
        >
          {/* Top-right dark slate arc */}
          <path
            d="M 50 10 A 40 40 0 0 1 88 56"
            stroke="#475569"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Bottom-left vibrant orange arc */}
          <path
            d="M 82 66 A 40 40 0 0 1 18 36"
            stroke="#f97316"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Left organic leaf (deep forest emerald) */}
          <path
            d="M 33 55 C 32 38 46 27 52 27 C 52 38 43 55 33 55 Z"
            fill="#2e7d32"
          />
          {/* Right fresh leaf (lime organic green) */}
          <path
            d="M 52 57 C 52 40 68 30 71 31 C 72 44 62 58 52 57 Z"
            fill="#84cc16"
          />
          {/* Subtle center stem highlight */}
          <path
            d="M 44 48 Q 48 38 52 30"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-tight text-lime-600 dark:text-lime-500 ${textSize}`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Pure <span className="text-emerald-600 dark:text-emerald-400">Bazar</span>
          </span>
          <span className="text-[10px] font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mt-0.5">
            Omnichannel Retail
          </span>
        </div>
      )}
    </div>
  );
};
