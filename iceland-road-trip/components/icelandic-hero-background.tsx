"use client"

interface IcelandicHeroBackgroundProps {
  variant?: "icelandic" | "glacier" | "waterfall" | "moss" | "volcanic"
}

export default function IcelandicHeroBackground({
  variant = "icelandic",
}: IcelandicHeroBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      {variant === "icelandic" && (
        <div className="absolute inset-0">
          <div className="icelandic-beam" />
          <div className="icelandic-beam" />
          <div className="icelandic-beam" />
        </div>
      )}
      <style jsx global>{`
        .icelandic-beam {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          opacity: 0.3;
          filter: blur(80px);
          transform: translateX(-50%) translateY(-50%);
          background: linear-gradient(
            90deg,
            rgba(2, 71, 254, 0) 0%,
            rgba(2, 71, 254, 0.5) 50%,
            rgba(2, 71, 254, 0) 100%
          );
          animation: icelandic-flow 15s ease infinite alternate;
        }

        .icelandic-beam:nth-child(2) {
          animation-duration: 25s;
          animation-delay: -5s;
          opacity: 0.2;
          filter: blur(100px);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        .icelandic-beam:nth-child(3) {
          animation-duration: 30s;
          animation-delay: -10s;
          opacity: 0.15;
          filter: blur(120px);
          background: linear-gradient(
            90deg,
            rgba(220, 30, 40, 0) 0%,
            rgba(220, 30, 40, 0.5) 50%,
            rgba(220, 30, 40, 0) 100%
          );
        }

        @keyframes icelandic-flow {
          0% {
            transform: translateX(-70%) translateY(-20%) rotate(-10deg);
            width: 100%;
            height: 20%;
          }
          50% {
            transform: translateX(0%) translateY(-40%) rotate(15deg);
            width: 150%;
            height: 30%;
          }
          100% {
            transform: translateX(70%) translateY(-20%) rotate(-5deg);
            width: 100%;
            height: 25%;
          }
        }
      `}</style>
    </div>
  )
}
