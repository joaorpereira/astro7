import { interactiveFocus, interactiveFocusSoft } from "@/shared/styles/interactive";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount?: number;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  resultCount,
  className,
}: SearchBarProps) {
  const hasValue = value.length > 0;
  const resultsId = "search-results";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && hasValue) {
      event.preventDefault();
      onClear();
    }
  };

  return (
    <div className={`w-full sm:max-w-xs ${className ?? ""}`}>
      <label htmlFor="customer-search" className="sr-only">
        Buscar cliente por nome
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          id="customer-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar por nome..."
          className={`w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus-visible:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-blue-400 ${interactiveFocusSoft}`}
          aria-describedby={resultCount !== undefined ? resultsId : undefined}
          autoComplete="off"
        />
        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            className={`absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${interactiveFocus}`}
            aria-label="Limpar busca"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
