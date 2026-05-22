"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verificarAccesoPortal } from '../../lib/authGuard';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Si esta página es de cliente, el portal debe ser 'cliente'
    if (!verificarAccesoPortal('cliente')) {
      router.push('/cliente/login');
    }
  }, [router]);

  return <>{children}</>;
}