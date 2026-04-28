"use client";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/john-git7", icon: "GH" },
  { name: "LinkedIn", url: "https://linkedin.com/in/john-ebenezer", icon: "LI" },
  { name: "Email", url: "mailto:contact@johnebenezer.dev", icon: "EM" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-primary-text/10 py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-heading text-xl text-primary-text tracking-tight">
              John Ebenezer
            </span>
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-primary-text/40">
              Full Stack Developer
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="group flex items-center gap-2 px-4 py-2 border border-primary-text/10 rounded-full hover:border-accent/40 hover:bg-accent/5 transition-all duration-500"
              >
                <span className="font-mono text-[10px] tracking-widest text-primary-text/50 group-hover:text-accent transition-colors">
                  {link.icon}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-primary-text/30 group-hover:text-primary-text/60 transition-colors hidden sm:inline">
                  {link.name}
                </span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="font-mono text-[9px] tracking-[0.2em] text-primary-text/25">
            © {new Date().getFullYear()} — All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
