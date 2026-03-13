import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Clock, Users, Heart } from "lucide-react";
import brochure from "@/assets/brochure.png";

const highlights = [
  { icon: Award, title: "4+ Years Experience", desc: "Seasoned professionals with deep industry expertise in web development." },
  { icon: Users, title: "MNC Background", desc: "Our team has delivered enterprise-grade solutions at major multinational companies." },
  { icon: Heart, title: "Passionate & Dedicated", desc: "We treat every project with the care and attention it deserves." },
  { icon: Clock, title: "Fast & Professional", desc: "Delivering pixel-perfect websites in 3–5 working days, every time." },
];

const AboutTeamSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative bg-section-alt" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">About Our Team</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
            Built by <span className="text-gradient-gold">Professionals</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            With 4+ years of experience and a background in leading MNC companies, we bring enterprise-quality craftsmanship to every small business project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Brochure image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl blur-2xl" style={{ background: "hsla(38, 75%, 50%, 0.08)" }} />
              <img
                src={brochure}
                alt="Site Craftsman Services — Professional business landing pages for gyms, salons, restaurants, institutes and more"
                className="relative w-full max-w-md rounded-2xl shadow-navy border border-border"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-background hover:shadow-gold-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <item.icon size={22} className="text-accent" />
                </div>
                <h3 className="text-base font-semibold font-heading mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
