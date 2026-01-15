'use client'
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Preloader } from '@/components/layout/Preloader'; // Importamos el componente

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {/* El Preloader aparece primero para bloquear la vista mientras carga */}
          <Preloader /> 
          
          <Navbar />
          
          {/* Main content */}
          <main>
            {children}
          </main>
          
          {/* <ThemeToggle />  */}
        </ThemeProvider>
      </body>
    </html>
  );
}