import { useEffect, useState } from "react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <nav className="nav-container">
        <div className="logo">
          <img src="/logo.png" alt="Shift Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#showcase">Showcase</a>
          <a href="#download" className="cta-button">
            Download
          </a>
        </div>
      </nav>
    </header>
  );
};
