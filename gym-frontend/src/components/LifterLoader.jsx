import React from 'react';

export default function LifterLoader() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 180 160" // slightly wider viewBox
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Barbell passes behind the head */}
      <g id="barbell">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,59; 0,25; 0,25; 0,59; 0,59"
          keyTimes="0; 0.3; 0.6; 0.8; 1"
          dur="1.5s"
          repeatCount="indefinite"
        />

        {/* Bar */}
        <rect x="5" y="-2" width="170" height="4" rx="2" fill="#b91c1c" />

        {/* LEFT PLATES (clustered tighter) */}
        <rect x="30" y="-22" width="8" height="44" rx="3" fill="#b91c1c" />
        <rect x="24" y="-18" width="6" height="36" rx="2" fill="#b91c1c" />
        <rect x="19" y="-14" width="5" height="28" rx="2" fill="#b91c1c" />

        {/* RIGHT PLATES (mirror tighter) */}
        <rect x="142" y="-22" width="8" height="44" rx="3" fill="#b91c1c" />
        <rect x="150" y="-18" width="6" height="36" rx="2" fill="#b91c1c" />
        <rect x="156" y="-14" width="5" height="28" rx="2" fill="#b91c1c" />
      </g>

      {/* Stickman */}
      <g
        stroke="#ffffff"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Head */}
        <circle cx="90" cy="52" r="13" fill="#ffffff" stroke="none">
          <animate
            attributeName="cy"
            values="52; 50; 50; 52; 52"
            keyTimes="0; 0.3; 0.6; 0.8; 1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Body */}
        <path d="M 90,67 L 90,112">
          <animate
            attributeName="d"
            values="M 90,67 L 90,112; M 90,65 L 90,110; M 90,65 L 90,110; M 90,67 L 90,112; M 90,67 L 90,112"
            keyTimes="0; 0.3; 0.6; 0.8; 1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Legs */}
        <path d="M 90,112 L 70,150 M 90,112 L 110,150">
          <animate
            attributeName="d"
            values="M 90,112 L 70,150 M 90,112 L 110,150; M 90,110 L 70,150 M 90,110 L 110,150; M 90,110 L 70,150 M 90,110 L 110,150; M 90,112 L 70,150 M 90,112 L 110,150; M 90,112 L 70,150 M 90,112 L 110,150"
            keyTimes="0; 0.3; 0.6; 0.8; 1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Left Arm */}
        <path d="M 90,67 L 60,87 L 52,59">
          <animate
            attributeName="d"
            values="M 90,67 L 60,87 L 52,59; M 90,65 L 71,45 L 52,25; M 90,65 L 71,45 L 52,25; M 90,67 L 60,87 L 52,59; M 90,67 L 60,87 L 52,59"
            keyTimes="0; 0.3; 0.6; 0.8; 1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Right Arm */}
        <path d="M 90,67 L 120,87 L 128,59">
          <animate
            attributeName="d"
            values="M 90,67 L 120,87 L 128,59; M 90,65 L 109,45 L 128,25; M 90,65 L 109,45 L 128,25; M 90,67 L 120,87 L 128,59; M 90,67 L 120,87 L 128,59"
            keyTimes="0; 0.3; 0.6; 0.8; 1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}