import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header1 from "./components/mvpblocks/header-1";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Showcase } from "./components/Showcase";
import { Personalization } from "./components/Personalization";
import SupportSection from "./components/mvpblocks/pricing-4";
import Faq2 from "./components/mvpblocks/faq-2";
import Footer4Col from "./components/mvpblocks/footer-4col";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import About from "./components/About";
import ScrollToTop from "./components/ScrollToTop";
import Developers from "./components/Developers";
import "./index.css";

function Landing() {
  return (
    <>
      <Header1 />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Personalization />
        <SupportSection />
        <Faq2 />
      </main>
      <Footer4Col />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/developers" element={<Developers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
