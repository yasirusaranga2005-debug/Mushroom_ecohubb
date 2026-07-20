import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  darkBg?: boolean;
}

export default function Logo({ className = '', showTagline = true, darkBg = false }: LogoProps) {
  // Theme-specific colors
  const strokeGreen = darkBg ? '#90A955' : '#386641';
  const leafGreen = darkBg ? '#A3B18A' : '#4F772D';
  const textBrown = darkBg ? '#F5F5F0' : '#3d2613';
  const textGreen = darkBg ? '#90A955' : '#386641';
  const taglineColor = darkBg ? '#D1C7BD' : '#5c4033';

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`} id="custom-brand-logo">
      {/* Icon Graphic */}
      <svg viewBox="0 0 100 100" className="h-12 w-12 shrink-0 overflow-visible" id="logo-icon-svg">
        {/* Outer Circular Arc */}
        <path
          d="M 22 76 A 38 38 0 1 1 78 76"
          fill="none"
          stroke={strokeGreen}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Grassy Ground Line */}
        <path
          d="M 16 82 Q 50 76 84 82"
          fill="none"
          stroke={strokeGreen}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Leaves */}
        {/* Left Leaf */}
        <path
          d="M 23 74 C 12 70, 10 52, 25 60 C 30 65, 27 71, 23 74 Z"
          fill={strokeGreen}
        />
        <path
          d="M 23 74 Q 20 64 25 60"
          fill="none"
          stroke={leafGreen}
          strokeWidth="1"
        />

        {/* Right Leaf */}
        <path
          d="M 77 74 C 88 70, 90 52, 75 60 C 70 65, 73 71, 77 74 Z"
          fill={strokeGreen}
        />
        <path
          d="M 77 74 Q 80 64 75 60"
          fill="none"
          stroke={leafGreen}
          strokeWidth="1"
        />

        {/* Mushrooms */}
        {/* Left Small Mushroom */}
        <path
          d="M 28 54 Q 28 78 35 78 L 41 75 Q 35 52, 28 54 Z"
          fill="#EAE6DF"
        />
        <path
          d="M 18 56 Q 30 36, 44 50 C 40 52, 22 57, 18 56 Z"
          fill="#6F4E37"
        />
        <path
          d="M 22 55 Q 31 46 39 50"
          fill="none"
          stroke="#5C3A21"
          strokeWidth="1"
        />

        {/* Right Small Mushroom */}
        <path
          d="M 59 75 L 65 78 Q 72 78 72 54 C 65 52, 59 52, 59 75 Z"
          fill="#EAE6DF"
        />
        <path
          d="M 56 50 Q 70 36, 82 56 C 78 57, 60 52, 56 50 Z"
          fill="#6F4E37"
        />
        <path
          d="M 61 50 Q 69 46 78 55"
          fill="none"
          stroke="#5C3A21"
          strokeWidth="1"
        />

        {/* Center Large Mushroom */}
        {/* Stem */}
        <path
          d="M 44 42 Q 40 76 44 76 L 56 76 Q 60 76 56 42 Z"
          fill="#F5F2EB"
        />
        {/* Cap */}
        <path
          d="M 32 42 Q 50 18 68 42 C 65 45, 35 45, 32 42 Z"
          fill="#6F4E37"
        />
        {/* Cap shadow/gills line */}
        <path
          d="M 32 42 Q 50 45 68 42"
          fill="none"
          stroke="#5C3A21"
          strokeWidth="1.5"
        />
      </svg>

      {/* Text Info */}
      <div className="flex flex-col text-left justify-center leading-none">
        {/* MUSHROOM */}
        <div 
          style={{ color: textBrown }}
          className="flex items-center font-sans font-black tracking-wider text-base md:text-lg uppercase leading-none"
        >
          <span>M</span>
          <span>U</span>
          <span>S</span>
          <span>H</span>
          <span className="mr-0.5">R</span>
          {/* Stylized O 1 */}
          <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] md:h-[16px] md:w-[16px] inline-block mx-[0.5px] shrink-0 align-middle">
            <path d="M 3 13 C 3 6, 21 6, 21 13 Z" fill="#6F4E37" />
            <path d="M 3 13 Q 12 16 21 13 Z" fill="#EAE6DF" />
            <path d="M 6 13 L 7 15 M 10 13 L 10 16 M 12 13 L 12 16 M 14 13 L 14 16 M 18 13 L 17 15" stroke="#6F4E37" strokeWidth="1" />
          </svg>
          {/* Stylized O 2 */}
          <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] md:h-[16px] md:w-[16px] inline-block mx-[0.5px] shrink-0 align-middle">
            <path d="M 3 13 C 3 6, 21 6, 21 13 Z" fill="#6F4E37" />
            <path d="M 3 13 Q 12 16 21 13 Z" fill="#EAE6DF" />
            <path d="M 6 13 L 7 15 M 10 13 L 10 16 M 12 13 L 12 16 M 14 13 L 14 16 M 18 13 L 17 15" stroke="#6F4E37" strokeWidth="1" />
          </svg>
          <span className="ml-[1px]">M</span>
        </div>

        {/* ECO HUB */}
        <div 
          style={{ color: textGreen }}
          className="font-sans font-extrabold tracking-[0.25em] text-[10px] md:text-[11px] uppercase mt-0.5 leading-none pl-[1px]"
        >
          — ECO HUB —
        </div>

        {/* TAGLINE */}
        {showTagline && (
          <div 
            style={{ color: taglineColor }}
            className="font-sans font-bold tracking-[0.06em] text-[6px] md:text-[6.8px] uppercase mt-1 leading-none pl-[1.5px] opacity-90"
          >
            TASTE LIKE MEAT, ZERO MEAT
          </div>
        )}
      </div>
    </div>
  );
}
