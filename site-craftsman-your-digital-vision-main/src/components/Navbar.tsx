import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import logoSymbol from "@/assets/logo-symbol-light.png";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Process", href: "/#process" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = ({ variant = "default" }: { variant?: "default" | "light" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = variant === "light" && !scrolled;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-navy" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img src={logoSymbol} alt="Site Craftsman Logo" className="h-11 w-11 object-contain" />
          <div className="flex flex-col leading-none">
            <span className={`text-sm font-bold font-heading tracking-wide transition-colors duration-300 ${isLight ? "text-primary-foreground" : "text-navy"}`}>SITE</span>
            <span className="text-sm font-bold font-heading tracking-wide text-gradient-gold">CRAFTSMAN</span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${
                isLight
                  ? "text-primary-foreground/80 hover:text-primary-foreground"
                  : "text-foreground/70 hover:text-navy"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 ${
              isLight
                ? "bg-primary-foreground text-navy shadow-navy"
                : "bg-gradient-navy text-primary-foreground shadow-navy"
            }`}
          >
            Get a Quote
          </a>
          <a
            href="/admin"
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isLight
                ? "text-primary-foreground/60 hover:text-primary-foreground"
                : "text-foreground/50 hover:text-navy"
            }`}
            title="Admin Login"
          >
            <ShieldCheck size={18} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 transition-colors duration-300 ${isLight ? "text-primary-foreground" : "text-foreground"}`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground/80 hover:text-navy transition-colors text-base font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="bg-gradient-navy text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold"
              >
                Get a Quote
              </a>
              <a
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-foreground/50 hover:text-navy transition-colors text-sm font-medium flex items-center gap-1.5"
              >
                <ShieldCheck size={16} /> Admin
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
