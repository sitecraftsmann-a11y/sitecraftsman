import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, Eye, EyeOff, ExternalLink, Image as ImageIcon, Video, Link as LinkIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASSWORD = "Nitish#0765";

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
  is_published: boolean;
  created_at: string;
  portfolio_media: PortfolioMedia[];
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(false);

  // New project form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [linkUrls, setLinkUrls] = useState<{ url: string; caption: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      toast.error("Incorrect password");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*, portfolio_media(*)")
      .order("created_at", { ascending: false });
    if (data) setProjects(data as PortfolioProject[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchProjects();
  }, [authenticated, fetchProjects]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSubmitting(true);

    // Create project
    const { data: project, error } = await supabase
      .from("portfolio_projects")
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        external_link: externalLink.trim() || null,
      })
      .select()
      .single();

    if (error || !project) {
      toast.error("Failed to create project");
      setSubmitting(false);
      return;
    }

    // Upload media files
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const ext = file.name.split(".").pop();
      const filePath = `${project.id}/${Date.now()}-${i}.${ext}`;
      const isVideo = file.type.startsWith("video/");

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
        await supabase.from("portfolio_media").insert({
          project_id: project.id,
          file_url: urlData.publicUrl,
          file_type: isVideo ? "video" : "image",
          sort_order: i,
        });
      }
    }

    // Add link entries
    for (let i = 0; i < linkUrls.length; i++) {
      if (linkUrls[i].url.trim()) {
        await supabase.from("portfolio_media").insert({
          project_id: project.id,
          file_url: linkUrls[i].url.trim(),
          file_type: "link",
          caption: linkUrls[i].caption.trim() || null,
          sort_order: mediaFiles.length + i,
        });
      }
    }

    toast.success("Project created!");
    resetForm();
    fetchProjects();
    setSubmitting(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setExternalLink("");
    setMediaFiles([]);
    setLinkUrls([]);
    setShowForm(false);
  };

  const togglePublish = async (project: PortfolioProject) => {
    await supabase
      .from("portfolio_projects")
      .update({ is_published: !project.is_published })
      .eq("id", project.id);
    fetchProjects();
    toast.success(project.is_published ? "Project hidden" : "Project published");
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project and all its media?")) return;
    // Delete storage files
    const { data: files } = await supabase.storage.from("portfolio").list(id);
    if (files?.length) {
      await supabase.storage.from("portfolio").remove(files.map((f) => `${id}/${f.name}`));
    }
    await supabase.from("portfolio_projects").delete().eq("id", id);
    fetchProjects();
    toast.success("Project deleted");
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-navy flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Card className="border-border/30">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-heading">Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full bg-gradient-navy hover:opacity-90">
                Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-navy text-primary-foreground py-4 px-4 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold">Portfolio Admin</h1>
          <div className="flex items-center gap-3">
            <a href="/portfolio" target="_blank" className="text-sm text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-1">
              <ExternalLink size={14} /> View Portfolio
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem("admin_auth");
                setAuthenticated(false);
              }}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Add Project Button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Projects ({projects.length})
          </h2>
          <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-navy hover:opacity-90">
            <Plus size={16} /> New Project
          </Button>
        </div>

        {/* New Project Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <Card className="mb-8 border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web Design, Branding" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={3} />
                </div>
                <div>
                  <Label>External Link</Label>
                  <Input value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." />
                </div>

                {/* File Upload */}
                <div>
                  <Label>Images & Videos</Label>
                  <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to upload</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => {
                        if (e.target.files) setMediaFiles(Array.from(e.target.files));
                      }}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 cursor-pointer"
                    />
                  </div>
                  {mediaFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mediaFiles.map((f, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {f.type.startsWith("video/") ? <Video className="inline h-3 w-3 mr-1" /> : <ImageIcon className="inline h-3 w-3 mr-1" />}
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div>
                  <Label>Links</Label>
                  {linkUrls.map((link, i) => (
                    <div key={i} className="flex gap-2 mt-2">
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...linkUrls];
                          updated[i].url = e.target.value;
                          setLinkUrls(updated);
                        }}
                        placeholder="URL"
                        className="flex-1"
                      />
                      <Input
                        value={link.caption}
                        onChange={(e) => {
                          const updated = [...linkUrls];
                          updated[i].caption = e.target.value;
                          setLinkUrls(updated);
                        }}
                        placeholder="Label"
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => setLinkUrls(linkUrls.filter((_, j) => j !== i))}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLinkUrls([...linkUrls, { url: "", caption: "" }])}
                    className="mt-2"
                  >
                    <LinkIcon size={14} /> Add Link
                  </Button>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSubmit} disabled={submitting} className="bg-gradient-navy hover:opacity-90">
                    {submitting ? "Creating..." : "Create Project"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No projects yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const thumbnail = project.portfolio_media
                ?.sort((a, b) => a.sort_order - b.sort_order)
                .find((m) => m.file_type === "image");
              return (
                <Card key={project.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-40 h-32 bg-muted flex-shrink-0">
                      {thumbnail ? (
                        <img src={thumbnail.file_url} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-semibold text-foreground">{project.title}</h3>
                          {!project.is_published && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Draft</span>
                          )}
                        </div>
                        {project.category && (
                          <span className="text-xs text-accent">{project.category}</span>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.portfolio_media?.length || 0} media items
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => togglePublish(project)} title={project.is_published ? "Hide" : "Publish"}>
                          {project.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-destructive hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
