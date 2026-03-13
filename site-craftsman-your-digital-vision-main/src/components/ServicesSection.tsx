import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  UtensilsCrossed, Dumbbell, GraduationCap, Home,
  Scissors, ShoppingBag, Stethoscope, Building2,
} from "lucide-react";

const services = [
  { icon: UtensilsCrossed, title: "Restaurants & Cafés", desc: "Menu showcases, online ordering pages & reservation systems" },
  { icon: Dumbbell, title: "Gyms & Fitness", desc: "Class schedules, trainer profiles & membership sign-up pages" },
  { icon: GraduationCap, title: "Institutes & Coaching", desc: "Course catalogs, admission forms & student portals" },
  { icon: Home, title: "Home Businesses", desc: "Product catalogs, order forms & brand storytelling pages" },
  { icon: Scissors, title: "Beauty Salons & Spas", desc: "Service menus, booking systems & portfolio galleries" },
  { icon: ShoppingBag, title: "Retail & E-commerce", desc: "Product showcases, cart pages & promotional landing pages" },
  { icon: Stethoscope, title: "Healthcare & Clinics", desc: "Appointment booking, doctor profiles & service pages" },
  { icon: Building2, title: "Real Estate & More", desc: "Property listings, contact forms & any business you have" },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative bg-section-light" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">What We Build</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
            Landing Pages for <span className="text-gradient-gold">Every Industry</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            We craft high-converting, stunning websites tailored to your business niche.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative p-6 rounded-2xl border border-border bg-background hover:border-accent/30 transition-all duration-300 hover:shadow-gold-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <service.icon size={22} className="text-accent" />
              </div>
              <h3 className="text-base font-semibold font-heading mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
