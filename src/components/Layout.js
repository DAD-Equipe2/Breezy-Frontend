'use client';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground bg-[linear-gradient(var(--grad-angle),var(--grad-from),var(--grad-to))] bg-[length:300%_300%] animate-bg-pan">
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
