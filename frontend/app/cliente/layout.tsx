"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verificarAccesoPortal } from '@/lib/authGuard';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
  const validar = async () => {
    const esValido = await authService.verificarSesion(); // Llama a tu API
    const accesoCorrecto = verificarAccesoPortal('cliente');

    if (!esValido || !accesoCorrecto) {
      router.push('/cliente/login');
    }
  };
  validar();
}, [router]);

  return <>{children}</>;
}