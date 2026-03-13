import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, IndianRupee, HeartHandshake, Smartphone, ShieldCheck, Headphones } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Lightning Fast Delivery", desc: "Get your website live in just 3–5 working days. No endless waiting." },
  { icon: IndianRupee, title: "Unbeatable Pricing", desc: "Premium-quality websites at prices designed for small & medium businesses." },
  { icon: HeartHandshake, title: "Built by Professionals", desc: "Clean code, modern frameworks, and pixel-perfect designs every time." },
  { icon: Smartphone, title: "100% Responsive", desc: "Your website looks stunning on every device — mobile, tablet & desktop." },
  { icon: ShieldCheck, title: "SEO Optimized", desc: "Built-in search engine optimization to boost your online visibility." },
  { icon: Headphones, title: "Post-Deployment Support", desc: "We don't disappear after launch. Ongoing support whenever you need it." },
];

const WhyUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-us" className="py-24 relative bg-section-alt" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">Why Site Craftsman</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
            Why Businesses <span className="text-gradient-gold">Choose Us</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            We combine speed, quality, and affordability like no one else.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-2xl border border-border bg-background hover:border-accent/30 transition-all duration-300 hover:shadow-gold-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-5 group-hover:glow-gold transition-all">
                <reason.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
