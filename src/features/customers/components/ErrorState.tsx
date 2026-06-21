import { interactiveFocusDanger } from "@/shared/styles/interactive";

interface ErrorStateProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ErrorState({ onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200/80 bg-red-50/80 px-6 py-10 text-center dark:border-red-900/40 dark:bg-red-950/20"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50">
        <svg
          aria-hidden="true"
          className="h-7 w-7 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-base font-semibold text-red-800 dark:text-red-300">
        Não foi possível carregar os dados.
      </h2>
      <p className="mt-2 text-sm text-red-700/80 dark:text-red-200/80">
        Verifique sua conexão e tente novamente.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 ${interactiveFocusDanger}`}
      >
        {isRetrying && (
          <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {isRetrying ? "Tentando novamente..." : "Tentar novamente"}
      </button>
    </div>
  );
}
