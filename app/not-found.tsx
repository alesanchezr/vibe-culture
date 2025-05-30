'use client';

import { Suspense } from 'react';
import Link from 'next/link';

function NotFoundContent() {
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-background dark:text-foreground flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground text-center mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Go Home
      </Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 dark:bg-background dark:text-foreground flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
} 