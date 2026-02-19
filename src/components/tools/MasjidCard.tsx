interface MasjidCardProps {
  name: string;
  address: string;
  distance?: string;
}

export function MasjidCard({ name, address, distance }: MasjidCardProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-surface p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {/* Mosque icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8 6 4 10 4 14v6a2 2 0 002 2h12a2 2 0 002-2v-6c0-4-4-8-8-12z" />
            <path d="M12 12v10" />
            <path d="M8 22v-4a4 4 0 018 0v4" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold text-ink dark:text-gray-100">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted dark:text-gray-400">
            {address}
          </p>
          {distance && (
            <p className="mt-1 text-sm font-medium text-primary-500">
              {distance}
            </p>
          )}
        </div>
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-primary-500 px-4 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-500/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        Get Directions
      </a>
    </div>
  );
}
