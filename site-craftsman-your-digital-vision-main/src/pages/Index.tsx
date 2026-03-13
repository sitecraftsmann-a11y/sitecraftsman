import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutTeamSection from "@/components/AboutTeamSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutTeamSection />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
