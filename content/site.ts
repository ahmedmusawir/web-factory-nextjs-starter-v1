type SiteContent = {
  name: string;
  title: string;
  description: string;
  navigation: { label: string; href: string }[];
  hero: { eyebrow: string; heading: string; text: string; action: string };
  features: { title: string; text: string }[];
};

export const site: SiteContent = {
  name: "Stark Studio",
  title: "Stark Studio — A clear place to begin",
  description: "Thoughtful websites, built around the things that matter.",
  navigation: [
    { label: "Approach", href: "#approach" },
    { label: "About", href: "#about" },
  ],
  hero: {
    eyebrow: "A small studio. A fresh perspective.",
    heading: "Make room for your next idea.",
    text: "A thoughtful starting point for what comes next. Clear words, useful details, and a little space to explore.",
    action: "Explore our approach",
  },
  features: [
    { title: "Start with purpose", text: "Give your idea a clear home. Keep the story focused on what matters to the people you want to reach." },
    { title: "Keep it simple", text: "Make every page easy to read, every detail useful, and every next step easy to find." },
    { title: "Make it yours", text: "Bring your own words and images. Build a place that feels like you, with room to grow over time." },
  ],
};
