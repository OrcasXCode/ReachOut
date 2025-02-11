export default function CustomRating({ value }: { value: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const isFull = i + 1 <= value;
        const isHalf = i + 0.5 < value && i + 1 > value;

        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill={isFull ? "gold" : isHalf ? "url(#halfGradient)" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="gold"
            className="w-6 h-6"
          >
            {/* Half Star Gradient */}
            {isHalf && (
              <defs>
                <linearGradient id="halfGradient">
                  <stop offset="50%" stopColor="gold" />
                  <stop offset="50%" stopColor="white" />
                </linearGradient>
              </defs>
            )}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        );
      })}
    </div>
  );
}
