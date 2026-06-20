'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          We encountered an unexpected error. Please try again.
        </p>
        <Button onClick={() => reset()} className="w-full sm:w-auto">
          Try again
        </Button>
      </div>
    </div>
  );
}
