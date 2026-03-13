import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioMedia {
  id: string;
  file_url: string;
  file_type: "image" | "video" | "link";
  caption: string | null;
  sort_order: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  external_link: string | null;
  created_at: string;
  portfolio_media: PortfolioMedia[];
}

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*, portfolio_media(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data as PortfolioProject[]);
    }
    setLoading(false);
  };

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  const getThumbnail = (project: PortfolioProject) => {
    const media = project.portfolio_media?.sort((a, b) => a.sort_order - b.sort_order);
    const image = media?.find((m) => m.file_type === "image");
    return image?.file_url || null;
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar variant="light" />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
          >
            Our <span className="text-gradient-gold">Portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/70 max-w-2xl mx-auto"
          >
            Explore the projects we've crafted for businesses across industries
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-gradient-navy text-primary-foreground shadow-navy"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, index) => {
                const thumbnail = getThumbnail(project);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:shadow-navy transition-all duration-300"
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-primary-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Project
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading font-semibold text-lg text-foreground">{project.title}</h3>
                        {project.external_link && (
                          <a
                            href={project.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-accent hover:text-accent/80"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      {project.category && (
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                          {project.category}
                        </span>
                      )}
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{project.description}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-navy"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">{selectedProject.title}</h2>
                  {selectedProject.category && (
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded mt-2 inline-block">
                      {selectedProject.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {selectedProject.description && (
                <p className="text-muted-foreground mb-6">{selectedProject.description}</p>
              )}

              {selectedProject.external_link && (
                <a
                  href={selectedProject.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 mb-6"
                >
                  <ExternalLink size={14} /> Visit Project
                </a>
              )}

              {/* Media Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProject.portfolio_media
                  ?.sort((a, b) => a.sort_order - b.sort_order)
                  .map((media) => (
                    <div key={media.id} className="rounded-lg overflow-hidden border border-border">
                      {media.file_type === "image" && (
                        <img src={media.file_url} alt={media.caption || ""} className="w-full h-auto" loading="lazy" />
                      )}
                      {media.file_type === "video" && (
                        <video src={media.file_url} controls className="w-full h-auto" />
                      )}
                      {media.file_type === "link" && (
                        <a
                          href={media.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                        >
                          <LinkIcon size={20} className="text-accent" />
                          <span className="text-sm text-foreground">{media.caption || media.file_url}</span>
                        </a>
                      )}
                      {media.caption && media.file_type !== "link" && (
                        <p className="p-3 text-sm text-muted-foreground">{media.caption}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Portfolio;
