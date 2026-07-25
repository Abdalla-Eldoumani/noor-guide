// A passthrough. `[locale]/layout.tsx` renders <html> and <body> because the
// locale decides `lang` and `dir`. Next still needs a root layout to exist for
// `not-found.tsx` boundaries below it to resolve, which is why an unmatched URL
// used to fall through to the built-in English 404.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
