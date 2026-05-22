"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verificarAccesoPortal } from '@/lib/authGuard';

export default function ProveedorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Si intentan entrar a cualquier página de proveedor sin ser 'empresa',
    // el sistema los expulsa automáticamente al login de proveedores
    if (!verificarAccesoPortal('empresa')) {
      router.push('/proveedor/login');
    }
  }, [router]);

  return (
    <div className="layout-proveedor">
      {children}
    </div>
  );
}