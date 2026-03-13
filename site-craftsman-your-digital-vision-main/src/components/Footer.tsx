import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import logoSymbol from "@/assets/logo-symbol-light.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border relative bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <img src={logoSymbol} alt="Site Craftsman" className="h-8 w-8 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-bold font-heading tracking-wide text-foreground">SITE</span>
              <span className="text-xs font-bold font-heading tracking-wide text-gradient-gold">CRAFTSMAN</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {[
              { icon: MessageCircle, href: "https://wa.me/919490130765", label: "WhatsApp" },
              { icon: Instagram, href: "https://instagram.com/sitecraftsmann", label: "Instagram" },
              { icon: Mail, href: "mailto:sitecraftsmann@gmail.com", label: "Email" },
              { icon: Phone, href: "tel:+919490130765", label: "Phone" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-200"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Site Craftsman. Crafting digital experiences for growing businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
