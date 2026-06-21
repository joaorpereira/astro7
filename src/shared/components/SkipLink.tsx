interface SkipLinkProps {
  href: string;
  label: string;
}

export function SkipLink({ href, label }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-blue-600 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
    >
      {label}
    </a>
  );
}
