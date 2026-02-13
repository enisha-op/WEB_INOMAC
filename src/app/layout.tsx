import { Navbar } from '@/components/layout/Navbar';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Preloader } from '@/components/layout/Preloader';
import { Metadata } from 'next'; // Importamos tipos de metadatos

// CONFIGURACIÓN MAESTRA DE SEO PARA GOOGLE
export const metadata: Metadata = {
  title: 'INOMAC | Venta de Camiones Sinotruk en Perú',
  description: 'Distribuidor autorizado de camiones y equipos pesados Sinotruk. Modelos Elite GNL y Diésel con la mejor tecnología para transporte en Perú.',
  keywords: ['INOMAC', 'Sinotruk Perú', 'venta de camiones', 'tractocamiones', 'camiones GNL'],
  authors: [{ name: 'INOMAC' }],
  creator: 'INOMAC',
  publisher: 'INOMAC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Esto ayuda a que Google sepa cuál es la URL oficial
  alternates: {
    canonical: 'https://inomac.com.pe',
  },
  // Cómo se ve al compartir en Facebook/WhatsApp
  openGraph: {
    title: 'INOMAC | Potencia para tu Negocio',
    description: 'Expertos en camiones de alto rendimiento.',
    url: 'https://inomac.com.pe',
    siteName: 'INOMAC Camiones',
    images: [
      {
        url: 'https://inomac.com.pe/og-image.jpg', // Asegúrate de tener esta imagen en /public
        width: 1200,
        height: 630,
        alt: 'Camiones Sinotruk INOMAC',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  // Cómo se ve en Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'INOMAC | Camiones Sinotruk Perú',
    description: 'Venta de camiones y equipos pesados de última generación.',
    images: ['https://inomac.com.pe/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon y tags básicos */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {/* El Preloader bloquea la vista mientras carga */}
          <Preloader /> 
          
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}