"use client";

import { cn } from "@/lib/utils";

const fullPageKeyframes = `
@keyframes leafTrace {
  0%        { stroke-dashoffset: 380; opacity: 1; }
  35%       { stroke-dashoffset: 0;   opacity: 1; }
  50%       { stroke-dashoffset: 0;   opacity: 0; }
  100%      { stroke-dashoffset: 0;   opacity: 0; }
}
@keyframes leafFill {
  0%, 30%   { opacity: 0; }
  45%       { opacity: 1; }
  85%       { opacity: 1; }
  100%      { opacity: 0; }
}
@keyframes letterReveal {
  0%, 40%   { opacity: 0; transform: translateY(4px); }
  52%       { opacity: 1; transform: translateY(0); }
  85%       { opacity: 1; }
  100%      { opacity: 0; }
}
@keyframes dotPop {
  0%, 45%   { opacity: 0; transform: scale(0); }
  55%       { opacity: 1; transform: scale(1.3); }
  60%, 85%  { opacity: 1; transform: scale(1); }
  100%      { opacity: 0; transform: scale(1); }
}
@keyframes containerBreath {
  0%, 55%   { transform: scale(1); }
  70%       { transform: scale(1.06); }
  85%, 100% { transform: scale(1); }
}
@keyframes sweepStroke {
  0%   { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -380; }
}
@keyframes sweepPulse {
  0%, 100% { opacity: 0.7; }
  50%      { opacity: 1; }
}
`;

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <style dangerouslySetInnerHTML={{ __html: fullPageKeyframes }} />
      <svg
        width="64"
        height="64"
        viewBox="0 0 120 120"
        fill="none"
        style={{ animation: "containerBreath 3s cubic-bezier(0.4,0,0.2,1) infinite" }}
      >
        {/* Leaf outline — traces itself */}
        <path
          d="M10 60C10 26.9 26.9 10 60 10H100C104.4 10 108 13.6 108 18V60C108 93.1 91.1 110 58 110H18C13.6 110 10 106.4 10 102V60Z"
          stroke="#1A3FC4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: 380,
            strokeDashoffset: 380,
            animation: "leafTrace 3s cubic-bezier(0.4,0,0.2,1) infinite",
          }}
        />
        {/* Leaf fill — fades in after trace */}
        <path
          d="M10 60C10 26.9 26.9 10 60 10H100C104.4 10 108 13.6 108 18V60C108 93.1 91.1 110 58 110H18C13.6 110 10 106.4 10 102V60Z"
          fill="#1A3FC4"
          style={{ opacity: 0, animation: "leafFill 3s cubic-bezier(0.4,0,0.2,1) infinite" }}
        />
        {/* "r" stem */}
        <path
          d="M52 82V58.5C52 52.5 55.5 48 62.5 48C64.5 48 66 48.3 67.5 49L67 56C65.8 55.3 64.2 55 62.5 55C58 55 56 58 56 62V82H52Z"
          fill="white"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0, animation: "letterReveal 3s cubic-bezier(0.4,0,0.2,1) infinite" }}
        />
        {/* "r" dot */}
        <circle
          cx="55"
          cy="42"
          r="4"
          fill="white"
          style={{
            opacity: 0,
            transformOrigin: "55px 42px",
            animation: "dotPop 3s cubic-bezier(0.4,0,0.2,1) infinite",
          }}
        />
      </svg>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fullPageKeyframes }} />
      <svg
        width="24"
        height="24"
        viewBox="0 0 120 120"
        fill="none"
        className={cn(className)}
        style={{ animation: "sweepPulse 1.8s cubic-bezier(0.4,0,0.2,1) infinite" }}
      >
        <path
          d="M10 60C10 26.9 26.9 10 60 10H100C104.4 10 108 13.6 108 18V60C108 93.1 91.1 110 58 110H18C13.6 110 10 106.4 10 102V60Z"
          fill="#1A3FC4"
          opacity="0.15"
        />
        <path
          d="M10 60C10 26.9 26.9 10 60 10H100C104.4 10 108 13.6 108 18V60C108 93.1 91.1 110 58 110H18C13.6 110 10 106.4 10 102V60Z"
          stroke="#1A3FC4"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: "100 280",
            animation: "sweepStroke 1.4s cubic-bezier(0.4,0,0.2,1) infinite",
          }}
        />
      </svg>
    </>
  );
}
