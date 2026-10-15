"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PortfolioData, SocialLink, CustomLink } from "@/types/portfolio";
import defaultData from "@/data/portfolio-content.json";

export default function AdminPage() {
  const [data, setData] = useState<PortfolioData>(defaultData as PortfolioData);
  const [activeTab, setActiveTab] = useState<"resume" | "links" | "certificates" | "profile" | "data">("resume");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Resume upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New custom link state
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkCategory, setNewLinkCategory] = useState<"project" | "social" | "doc" | "other">("social");
  const [newLinkShowHero, setNewLinkShowHero] = useState(true);
  const [newLinkShowFooter, setNewLinkShowFooter] = useState(true);

  // Core stack input
  const [newStackTag, setNewStackTag] = useState("");

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Fetch current portfolio data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load portfolio data from API:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Save changes to API
  const handleSaveChanges = async (updatedData = data) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result.data || updatedData);
        showToast("Changes saved successfully to portfolio!", "success");
      } else {
        const error = await res.json();
        showToast(error.error || "Failed to save changes", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Error saving data. Please check connection.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      showToast("Please select a PDF file first", "info");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      showToast("Only PDF files are supported for resume", "error");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setData((prev) => ({
          ...prev,
          resume: result.resume,
        }));
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        showToast("Resume uploaded and activated successfully!", "success");
      } else {
        showToast(result.error || "Failed to upload resume", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Network error uploading resume.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        showToast("Please drop a PDF document", "error");
      }
    }
  };

  // Add custom link
  const handleAddCustomLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) {
      showToast("Link label and URL are required", "info");
      return;
    }

    const newLink: CustomLink = {
      id: `link-${Date.now()}`,
      label: newLinkLabel.trim(),
      url: newLinkUrl.trim(),
      category: newLinkCategory,
      showInHero: newLinkShowHero,
      showInFooter: newLinkShowFooter,
    };

    const updated = {
      ...data,
      customLinks: [...(data.customLinks || []), newLink],
    };

    setData(updated);
    setNewLinkLabel("");
    setNewLinkUrl("");
    handleSaveChanges(updated);
  };

  // Delete custom link
  const handleDeleteCustomLink = (id: string) => {
    const updated = {
      ...data,
      customLinks: (data.customLinks || []).filter((l) => l.id !== id),
    };
    setData(updated);
    handleSaveChanges(updated);
  };

  // Update social link
  const handleUpdateSocialLink = (index: number, url: string) => {
    const updatedSocialLinks = [...data.socialLinks];
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], url };
    setData({ ...data, socialLinks: updatedSocialLinks });
  };

  // Update certificate link
  const handleUpdateCertificate = (key: keyof PortfolioData["certificates"], value: string) => {
    setData({
      ...data,
      certificates: {
        ...data.certificates,
        [key]: value,
      },
    });
  };

  // Add tech stack item
  const handleAddStackTag = () => {
    if (!newStackTag.trim()) return;
    if (data.coreStack.includes(newStackTag.trim())) {
      showToast("Tag already exists", "info");
      return;
    }
    const updated = {
      ...data,
      coreStack: [...data.coreStack, newStackTag.trim()],
    };
    setData(updated);
    setNewStackTag("");
  };

  const handleRemoveStackTag = (tag: string) => {
    const updated = {
      ...data,
      coreStack: data.coreStack.filter((t) => t !== tag),
    };
    setData(updated);
  };

  // Export JSON
  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Backup JSON exported!", "success");
  };

  // Import JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.resume && Array.isArray(parsed.socialLinks)) {
            setData(parsed);
            handleSaveChanges(parsed);
            showToast("Backup restored and saved!", "success");
          } else {
            showToast("Invalid JSON schema for portfolio data", "error");
          }
        } catch (err) {
          showToast("Error parsing JSON file", "error");
        }
      };
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all portfolio data back to initial defaults?")) {
      setData(defaultData as PortfolioData);
      handleSaveChanges(defaultData as PortfolioData);
      showToast("Reset to defaults successful", "info");
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-accent selection:text-bg-base font-sans pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-mono backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 bg-bg-surface border-white/20">
          <span
            className={`w-2 h-2 rounded-full ${
              notification.type === "success"
                ? "bg-proj-leadvelox"
                : notification.type === "error"
                ? "bg-proj-docurag"
                : "bg-proj-browserdrm"
            }`}
          />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-bg-base/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-text-secondary hover:text-text-primary transition-colors font-mono text-caption uppercase flex items-center gap-1.5 group"
            >
              <span>←</span>
              <span className="group-hover:underline">Portfolio</span>
            </Link>
            <div className="h-4 w-px bg-hairline" />
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="font-mono text-sm tracking-wider uppercase text-text-primary font-bold">
                Admin Console
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-hairline text-text-secondary">
                No Auth Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 border border-hairline rounded hover:bg-white/5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <span>View Site</span>
              <span>↗</span>
            </Link>
            <button
              onClick={() => handleSaveChanges()}
              disabled={isSaving}
              className="px-4 py-1.5 bg-accent text-bg-base hover:bg-accent-hover active:bg-accent-active disabled:opacity-50 text-xs font-mono uppercase font-bold tracking-wider rounded transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-3 h-3 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save All</span>
                  <span>✓</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-4 mb-8">
          {[
            { id: "resume", label: "Resume Upload", icon: "📄" },
            { id: "links", label: "Links & Socials", icon: "🔗" },
            { id: "certificates", label: "Certificates & Proofs", icon: "🎓" },
            { id: "profile", label: "Profile & Bio", icon: "👤" },
            { id: "data", label: "Backup & Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-white/10 text-text-primary border border-white/20 font-semibold shadow-inner"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: RESUME UPLOAD */}
        {activeTab === "resume" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Current Active Resume Card */}
            <div className="p-6 rounded-lg border border-hairline bg-bg-surface/60 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-hairline">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Active Resume
                  </span>
                  <h3 className="text-xl font-medium text-text-primary mt-1">
                    {data.resume.filename || "John_Ebenezer_CV.pdf"}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 font-mono text-xs text-text-secondary">
                    <span>Size: {data.resume.fileSize || "163 KB"}</span>
                    <span>•</span>
                    <span>
                      Updated:{" "}
                      {data.resume.lastUpdated
                        ? new Date(data.resume.lastUpdated).toLocaleDateString()
                        : "Current"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={data.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-hairline hover:border-white/40 rounded text-xs font-mono uppercase tracking-wider text-text-primary hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <span>View / Download Current PDF</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-all ${
                  dragActive
                    ? "border-accent bg-white/5 scale-[1.005]"
                    : "border-hairline hover:border-text-secondary/50 bg-black/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="resume-file-input"
                />

                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-hairline flex items-center justify-center text-xl text-accent">
                    📄
                  </div>

                  <div className="space-y-1">
                    <p className="font-sans text-sm text-text-primary font-medium">
                      Drag and drop your new resume PDF here, or{" "}
                      <label
                        htmlFor="resume-file-input"
                        className="text-accent underline cursor-pointer hover:text-accent-hover"
                      >
                        browse file
                      </label>
                    </p>
                    <p className="font-mono text-xs text-text-secondary">
                      Only PDF documents supported (recommended: under 10MB)
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-white/5 border border-white/20 rounded flex items-center gap-3 max-w-md w-full justify-between font-mono text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-proj-leadvelox">✓ Selected:</span>
                        <span className="truncate text-text-primary">{selectedFile.name}</span>
                        <span className="text-text-secondary">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-text-secondary hover:text-proj-docurag transition-colors font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleResumeUpload()}
                      disabled={!selectedFile || isUploading}
                      className="px-6 py-2.5 bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent rounded font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 shadow-lg"
                    >
                      {isUploading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
                          <span>Uploading PDF...</span>
                        </>
                      ) : (
                        <>
                          <span>Upload & Activate Resume</span>
                          <span>↑</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume Settings */}
              <div className="mt-6 pt-6 border-t border-hairline grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-2">
                    Resume Button Label on Website
                  </label>
                  <input
                    type="text"
                    value={data.resume.label || "Resume"}
                    onChange={(e) =>
                      setData({
                        ...data,
                        resume: { ...data.resume, label: e.target.value },
                      })
                    }
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none transition-colors"
                    placeholder="Resume"
                  />
                  <p className="font-mono text-[11px] text-text-secondary mt-1">
                    Label displayed in the Hero and Footer navigation links.
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-2">
                    Direct Resume Path / URL
                  </label>
                  <input
                    type="text"
                    value={data.resume.url}
                    onChange={(e) =>
                      setData({
                        ...data,
                        resume: { ...data.resume, url: e.target.value },
                      })
                    }
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none transition-colors"
                  />
                  <p className="font-mono text-[11px] text-text-secondary mt-1">
                    Points to the active PDF file served from public directory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LINKS & SOCIALS */}
        {activeTab === "links" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Primary Social & Contact Links */}
            <div className="p-6 rounded-lg border border-hairline bg-bg-surface/60">
              <h3 className="font-mono text-sm uppercase tracking-wider text-text-primary font-semibold mb-4 flex items-center justify-between">
                <span>Primary Social & Contact Links</span>
                <span className="text-xs text-text-secondary font-normal">Shown in Hero & Footer</span>
              </h3>

              <div className="space-y-4">
                {data.socialLinks.map((link, index) => (
                  <div key={link.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div className="font-mono text-xs uppercase tracking-wider text-text-secondary flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent/40" />
                      <span>{link.label}</span>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateSocialLink(index, e.target.value)}
                        className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none transition-colors"
                      />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-2 border border-hairline rounded text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors font-mono"
                        title="Open & Test link"
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Links Management */}
            <div className="p-6 rounded-lg border border-hairline bg-bg-surface/60">
              <h3 className="font-mono text-sm uppercase tracking-wider text-text-primary font-semibold mb-2">
                Custom Links
              </h3>
              <p className="font-mono text-xs text-text-secondary mb-6">
                Add extra links (e.g. Substack, Twitter/X, Dev.to, Personal Blog, Notion docs).
              </p>

              {/* Add New Link Form */}
              <div className="p-4 rounded border border-hairline bg-black/40 mb-6 space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-accent font-medium">
                  + Add New Link
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1">
                      Label / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Twitter / X"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                      className="w-full bg-black/60 border border-hairline rounded px-3 py-1.5 text-xs text-text-primary font-mono focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1">
                      Target URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://x.com/username"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-full bg-black/60 border border-hairline rounded px-3 py-1.5 text-xs text-text-primary font-mono focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={newLinkCategory}
                      onChange={(e) => setNewLinkCategory(e.target.value as any)}
                      className="w-full bg-black/60 border border-hairline rounded px-2 py-1.5 text-xs text-text-primary font-mono focus:border-accent focus:outline-none"
                    >
                      <option value="social">Social</option>
                      <option value="project">Project</option>
                      <option value="doc">Document</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-6 font-mono text-xs text-text-secondary">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLinkShowHero}
                        onChange={(e) => setNewLinkShowHero(e.target.checked)}
                        className="rounded border-hairline accent-accent"
                      />
                      <span>Show in Hero</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLinkShowFooter}
                        onChange={(e) => setNewLinkShowFooter(e.target.checked)}
                        className="rounded border-hairline accent-accent"
                      />
                      <span>Show in Footer</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCustomLink}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-text-primary rounded font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    Add Link
                  </button>
                </div>
              </div>

              {/* Current Custom Links */}
              {data.customLinks && data.customLinks.length > 0 ? (
                <div className="space-y-3">
                  {data.customLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded border border-hairline bg-black/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="font-semibold text-text-primary">{link.label}</span>
                        <span className="text-text-secondary truncate max-w-xs">{link.url}</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-hairline text-[10px] text-text-secondary uppercase">
                          {link.category || "custom"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-text-secondary">
                          {link.showInHero && "Hero"} {link.showInHero && link.showInFooter && "•"}{" "}
                          {link.showInFooter && "Footer"}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          ↗
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomLink(link.id)}
                          className="text-text-secondary hover:text-proj-docurag transition-colors font-bold"
                          title="Delete link"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-text-secondary italic text-center py-4">
                  No custom links added yet. Use the form above to add one.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES & PROOFS */}
        {activeTab === "certificates" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-lg border border-hairline bg-bg-surface/60">
              <h3 className="font-mono text-sm uppercase tracking-wider text-text-primary font-semibold mb-2">
                External Certificates & Proof Links
              </h3>
              <p className="font-mono text-xs text-text-secondary mb-6">
                Update Google Drive links and credentials shown in the Experience and Achievements sections.
              </p>

              <div className="space-y-6">
                {/* Zippy */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-text-primary font-medium">
                      Web Developer Intern Certificate (Zippy Digital)
                    </label>
                    <a
                      href={data.certificates.zippyInternship}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Test URL</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={data.certificates.zippyInternship}
                    onChange={(e) => handleUpdateCertificate("zippyInternship", e.target.value)}
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                {/* n8n */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-text-primary font-medium">
                      n8n Workshop Session Images Link
                    </label>
                    <a
                      href={data.certificates.n8nWorkshop}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Test URL</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={data.certificates.n8nWorkshop}
                    onChange={(e) => handleUpdateCertificate("n8nWorkshop", e.target.value)}
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                {/* NASA */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-text-primary font-medium">
                      NASA International Space Apps Challenge Certificate
                    </label>
                    <a
                      href={data.certificates.nasaSpaceApps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Test URL</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={data.certificates.nasaSpaceApps}
                    onChange={(e) => handleUpdateCertificate("nasaSpaceApps", e.target.value)}
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                {/* NeuroBots */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-text-primary font-medium">
                      NeuroBots Global Robotics Championship (IIT Palakkad)
                    </label>
                    <a
                      href={data.certificates.neuroBots}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Test URL</span>
                      <span>↗</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={data.certificates.neuroBots}
                    onChange={(e) => handleUpdateCertificate("neuroBots", e.target.value)}
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & BIO */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-lg border border-hairline bg-bg-surface/60 space-y-6">
              <h3 className="font-mono text-sm uppercase tracking-wider text-text-primary font-semibold mb-2">
                Header & Hero Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.firstName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, firstName: e.target.value },
                      })
                    }
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
                    Last Name (Accent Highlight)
                  </label>
                  <input
                    type="text"
                    value={data.profile.lastName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, lastName: e.target.value },
                      })
                    }
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
                  Tagline (Typewriter Text)
                </label>
                <input
                  type="text"
                  value={data.profile.tagline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, tagline: e.target.value },
                    })
                  }
                  className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
                  placeholder="Full-Stack Developer"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
                  Hero Short Bio
                </label>
                <textarea
                  rows={3}
                  value={data.profile.shortBio}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, shortBio: e.target.value },
                    })
                  }
                  className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-sans focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-1">
                  About Section Detailed Paragraph
                </label>
                <textarea
                  rows={4}
                  value={data.profile.aboutText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, aboutText: e.target.value },
                    })
                  }
                  className="w-full bg-black/60 border border-hairline rounded px-3 py-2 text-sm text-text-primary font-sans focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>

              {/* Core Stack Management */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-text-secondary mb-2">
                  Core Stack Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.coreStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-white/5 border border-hairline rounded font-mono text-xs text-text-primary flex items-center gap-1.5"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStackTag(tech)}
                        className="text-text-secondary hover:text-proj-docurag text-[10px] font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add technology (e.g. Redis, Rust)"
                    value={newStackTag}
                    onChange={(e) => setNewStackTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddStackTag();
                      }
                    }}
                    className="w-full bg-black/60 border border-hairline rounded px-3 py-1.5 text-xs text-text-primary font-mono focus:border-accent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddStackTag}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-wider rounded text-text-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP & SETTINGS */}
        {activeTab === "data" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-lg border border-hairline bg-bg-surface/60 space-y-6">
              <h3 className="font-mono text-sm uppercase tracking-wider text-text-primary font-semibold mb-2">
                Configuration Backup & Persistence
              </h3>
              <p className="font-mono text-xs text-text-secondary mb-6">
                All changes made here are saved directly into your project's JSON store and will automatically render on the site.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Export */}
                <div className="p-4 border border-hairline rounded bg-black/30 flex flex-col justify-between">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-text-primary font-semibold mb-1">
                      Export Backup
                    </h4>
                    <p className="font-sans text-xs text-text-secondary mb-4">
                      Download current portfolio configuration as a JSON file.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="w-full px-3 py-2 border border-hairline hover:bg-white/5 rounded font-mono text-xs uppercase tracking-wider text-text-primary transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Download JSON</span>
                    <span>↓</span>
                  </button>
                </div>

                {/* Import */}
                <div className="p-4 border border-hairline rounded bg-black/30 flex flex-col justify-between">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-text-primary font-semibold mb-1">
                      Restore Backup
                    </h4>
                    <p className="font-sans text-xs text-text-secondary mb-4">
                      Upload a previously exported JSON backup file.
                    </p>
                  </div>
                  <label className="w-full px-3 py-2 border border-hairline hover:bg-white/5 rounded font-mono text-xs uppercase tracking-wider text-text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Import JSON</span>
                    <span>↑</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset Defaults */}
                <div className="p-4 border border-hairline rounded bg-black/30 flex flex-col justify-between">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-proj-docurag font-semibold mb-1">
                      Factory Reset
                    </h4>
                    <p className="font-sans text-xs text-text-secondary mb-4">
                      Reset all settings and links back to codebase defaults.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="w-full px-3 py-2 border border-proj-docurag/40 hover:bg-proj-docurag/10 rounded font-mono text-xs uppercase tracking-wider text-proj-docurag transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Secret Button info card */}
              <div className="mt-8 p-4 rounded border border-hairline bg-white/[0.02]">
                <h4 className="font-mono text-xs uppercase tracking-wider text-accent mb-2">
                  Hidden Access Shortcuts
                </h4>
                <ul className="font-mono text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                  <li>
                    <strong className="text-text-primary">Keyboard Shortcut:</strong> Press <code className="bg-white/10 px-1 py-0.5 rounded text-text-primary">Ctrl + Shift + A</code> (or <code className="bg-white/10 px-1 py-0.5 rounded text-text-primary">Cmd + Shift + A</code>) anywhere on the portfolio.
                  </li>
                  <li>
                    <strong className="text-text-primary">Secret Period:</strong> Click the punctuation mark <code className="bg-white/10 px-1 py-0.5 rounded text-text-primary">.</code> in the footer headline <strong className="text-text-primary">"Let's talk."</strong>
                  </li>
                  <li>
                    <strong className="text-text-primary">Stealth Corner Trigger:</strong> Move your cursor to the extreme bottom-right corner of the website window.
                  </li>
                  <li>
                    <strong className="text-text-primary">Direct Route:</strong> Navigate directly to <code className="bg-white/10 px-1 py-0.5 rounded text-text-primary">/admin</code> in the browser URL.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
