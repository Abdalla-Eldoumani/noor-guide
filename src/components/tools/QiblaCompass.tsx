"use client";

interface QiblaCompassProps {
  bearing: number;
}

export function QiblaCompass({ bearing }: QiblaCompassProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Compass container */}
      <div className="relative h-72 w-72 sm:h-80 sm:w-80">
        {/* Outer compass circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 bg-surface shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {/* Cardinal direction markers */}
          <span className="absolute left-1/2 top-3 -translate-x-1/2 font-heading text-sm font-bold text-primary-500">
            N
          </span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-muted dark:text-gray-400">
            E
          </span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-heading text-sm font-bold text-muted dark:text-gray-400">
            S
          </span>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-heading text-sm font-bold text-muted dark:text-gray-400">
            W
          </span>

          {/* Degree tick marks (every 30 degrees) */}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => (
            <div
              key={deg}
              className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div className="mx-auto h-3 w-0.5 bg-gray-300 dark:bg-gray-500" />
            </div>
          ))}

          {/* Qibla direction arrow */}
          <div
            className="absolute left-1/2 top-0 h-1/2 w-8 -translate-x-1/2 origin-bottom transition-transform duration-500"
            style={{ transform: `translateX(-50%) rotate(${bearing}deg)` }}
          >
            {/* Arrow SVG */}
            <svg
              viewBox="0 0 32 140"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Arrow tip */}
              <polygon
                points="16,0 6,36 26,36"
                className="fill-primary-500"
              />
              {/* Arrow shaft */}
              <rect
                x="13"
                y="34"
                width="6"
                height="80"
                rx="3"
                className="fill-primary-500 opacity-60"
              />
            </svg>
          </div>

          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500 shadow-md" />
        </div>
      </div>

      {/* Bearing text */}
      <div className="text-center">
        <p className="font-heading text-3xl font-bold text-primary-500">
          {bearing.toFixed(1)}&deg;
        </p>
        <p className="mt-1 text-sm text-muted dark:text-gray-400">
          from North
        </p>
      </div>
    </div>
  );
}
