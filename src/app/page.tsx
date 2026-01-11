import { Hero } from '@/components/sections/Hero';
import { CatalogElite } from '@/components/sections/CatalogElite';
import { Specs } from '@/components/sections/Specs';
import { Services } from '@/components/sections/Services';
import { Finance } from '@/components/sections/Finance';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppBtn } from '@/components/ui/WhatsAppBtn';  

export default function Home() {
  return (
    <main>
      <Hero />
      <CatalogElite />
      <Specs />
      <Services />
      <Finance />
      <Contact />
      <Footer />
      <WhatsAppBtn />
    </main>
  );
}