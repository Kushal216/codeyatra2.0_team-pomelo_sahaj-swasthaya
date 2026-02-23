'use client';
import { useSyncExternalStore } from 'react';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';

const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

export default function NavbarWrapper() {
  const { user, logout } = useAuth();
  const isClient = useIsClient();

  // Render a placeholder on the server so server/client HTML always matches.
  // The real Navbar (with auth-aware links) renders only after hydration.
  if (!isClient) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-14" />
    );
  }

  return <Navbar user={user} onLogout={logout} />;
}
