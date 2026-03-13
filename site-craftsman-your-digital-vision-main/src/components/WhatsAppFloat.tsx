import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => (
  <motion.a
    href="https://wa.me/919490130765"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
    style={{ boxShadow: "0 0 20px rgba(37, 211, 102, 0.4)" }}
  >
    <MessageCircle size={26} className="text-foreground" style={{ color: "white" }} />
  </motion.a>
);

export default WhatsAppFloat;
