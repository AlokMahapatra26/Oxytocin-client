'use client';

import { useUser } from '@stackframe/stack';
import ApiTester from '@/components/api-tester';
import LandingPage from '@/components/landing-page';

export default function Home() {
  const user = useUser();

  // Show loading state
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show API tester for authenticated users
  return <ApiTester />;
}
