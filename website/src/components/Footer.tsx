import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/logo.png" alt="Shift Logo" className="logo-image" />
          <p>&copy; 2025 Shift App. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/Azevedo05"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <Github size={18} strokeWidth={2} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
