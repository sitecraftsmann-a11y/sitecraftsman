import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Palette, Code2, Rocket } from "lucide-react";

const steps = [
  { icon: MessageSquare, step: "01", title: "Share Your Vision", desc: "Tell us about your business, goals, and preferences via WhatsApp or email." },
  { icon: Palette, step: "02", title: "Design & Draft", desc: "We craft a stunning, on-brand design tailored to your industry." },
  { icon: Code2, step: "03", title: "Develop & Refine", desc: "Your website is built with clean code, animations, and full responsiveness." },
  { icon: Rocket, step: "04", title: "Launch & Support", desc: "We deploy your site and provide ongoing support after launch." },
];

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-24 relative bg-section-light" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
            Simple <span className="text-gradient-gold">4-Step Process</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            From idea to launch — we make it effortless for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative text-center p-8 rounded-2xl border border-border bg-background"
            >
              <div className="text-5xl font-bold text-accent/10 font-heading absolute top-4 right-6">
                {step.step}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <step.icon size={24} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>

              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
