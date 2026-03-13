import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, MessageCircle, Instagram, Mail, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  businessType: z.string().trim().min(2, "Please describe your business type").max(200, "Business type must be less than 200 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const msg = `Hi! I'm ${data.name}.%0ABusiness: ${encodeURIComponent(data.businessType)}%0AEmail: ${data.email}%0APhone: ${data.phone}%0AMessage: ${encodeURIComponent(data.message)}`;
    window.open(`https://wa.me/919490130765?text=${msg}`, "_blank");
    setSubmitted(true);
    toast({ title: "Message prepared!", description: "Your enquiry has been opened in WhatsApp. We'll respond shortly!" });
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    { icon: MessageCircle, label: "WhatsApp", value: "+91 94901 30765", href: "https://wa.me/919490130765" },
    { icon: Instagram, label: "Instagram", value: "@sitecraftsmann", href: "https://instagram.com/sitecraftsmann" },
    { icon: Mail, label: "Email", value: "sitecraftsmann@gmail.com", href: "mailto:sitecraftsmann@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91 94901 30765", href: "tel:+919490130765" },
  ];

  return (
    <section id="contact" className="py-24 relative bg-section-alt" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
            Let's Build Your <span className="text-gradient-gold">Dream Website</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Share your requirements and we'll get back to you within hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-xl font-semibold font-heading mb-4">Reach Us Directly</h3>
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-accent/30 hover:shadow-gold-sm transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <info.icon size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{info.label}</div>
                  <div className="text-sm font-medium">{info.value}</div>
                </div>
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-2xl border border-border bg-background space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <input id="name" {...register("name")} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Your full name" />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email *</label>
                  <input id="email" type="email" {...register("email")} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="you@company.com" />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1.5">Phone Number *</label>
                  <input id="phone" type="tel" {...register("phone")} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Enter 10-digit mobile number" />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium mb-1.5">Business Type *</label>
                  <input id="businessType" {...register("businessType")} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Restaurant, Gym, Salon..." />
                  {errors.businessType && <p className="text-destructive text-xs mt-1">{errors.businessType.message}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1.5">Project Details *</label>
                <textarea id="message" rows={4} {...register("message")} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none" placeholder="Tell us about your project requirements..." />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-navy text-primary-foreground py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-navy disabled:opacity-60">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : submitted ? <><CheckCircle2 size={18} /> Sent Successfully!</> : <><Send size={18} /> Send via WhatsApp</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
