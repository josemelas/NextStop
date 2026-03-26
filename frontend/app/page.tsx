import Link from 'next/link';
import { Plane, Building2, BriefcaseBusiness, UserCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 flex flex-col items-center">
      {/* 1. Navbar - Se mantiene igual pero con un margen inferior más ajustado */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-12 px-6 py-4 bg-white rounded-full shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <Plane className="w-8 h-8 text-stop-navy bg-slate-100 p-1.5 rounded-lg" />
          <h1 className="text-3xl font-bold text-stop-navy tracking-tighter">
            Next<span className="text-stop-accent">Stop</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#" className="hover:text-stop-navy transition-colors">Destinos</a>
          <a href="#" className="hover:text-stop-navy transition-colors">Nosotros</a>
          <a href="#" className="hover:text-stop-navy transition-colors">Contacto</a>
          <Link
            href="/login/cliente"
            className="flex items-center gap-2 bg-stop-navy text-white px-5 py-2.5 rounded-full text-sm hover:bg-slate-800 transition shadow-md shadow-blue-900/10"
          >
            <UserCircle className="w-5 h-5" />
            Iniciar Sesión
          </Link>
        </nav>
      </header>

      {/* 2. Hero Section - Espacio reducido para centrar el contenido visualmente */}
      <section className="w-full max-w-5xl text-center pt-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
          Next<span className="text-stop-accent">Stop </span> Planificador de Viajes
        </h2>

        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-14 leading-relaxed">
          Una plataforma inteligente para gestionar y publicar experiencias de viaje. Conecta agencias con viajeros de forma fluida.
        </p>

        {/* 3. Tarjetas de Acceso */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Tarjeta: Proveedor */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-left hover:shadow-2xl transition-all duration-300">
            <div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 border border-slate-200">
              <Building2 className="w-7 h-7 text-stop-navy" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950 mb-3">Entrar como Proveedor</h3>
            <p className="text-slate-600 mb-8 leading-relaxed text-sm">
              Las agencias de viajes pueden publicar sus mejores vuelos y destinos para llegar a viajeros de todo el mundo.
            </p>
            <Link
              href="/login/proveedor"
              className="w-full flex justify-between items-center bg-slate-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all group"
            >
              Entrar al Panel
              <span className="text-xl group-hover:translate-x-2 transition-transform">›</span>
            </Link>
          </div>

          {/* Tarjeta: Cliente */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-left hover:shadow-2xl transition-all duration-300">
            <div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 border border-slate-200">
              <BriefcaseBusiness className="w-7 h-7 text-stop-navy" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950 mb-3">Entrar como Cliente</h3>
            <p className="text-slate-600 mb-8 leading-relaxed text-sm">
              Busca, compara y reserva tus vuelos de forma segura. Accede a tu historial de viajes y gestiona tus reservas.
            </p>
            <Link
              href="/login/cliente"
              className="w-full flex justify-between items-center bg-stop-accent text-white px-6 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all group"
            >
              Acceder como Cliente
              <span className="text-xl group-hover:translate-x-2 transition-transform">›</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
