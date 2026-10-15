export interface SocialLink {
  id: string;
  label: string;
  url: string;
  isMail?: boolean;
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  description?: string;
  category?: "project" | "social" | "doc" | "other";
  showInHero?: boolean;
  showInFooter?: boolean;
}

export interface PortfolioData {
  profile: {
    firstName: string;
    lastName: string;
    tagline: string;
    shortBio: string;
    aboutText: string;
    availabilityStatus?: string;
  };
  resume: {
    url: string;
    filename: string;
    label: string;
    fileSize?: string;
    lastUpdated?: string;
  };
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
  certificates: {
    zippyInternship: string;
    n8nWorkshop: string;
    nasaSpaceApps: string;
    neuroBots: string;
  };
  coreStack: string[];
}
