import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import SpringScroll from "../components/SpringScroll";
import ScrollProgress from "../components/ScrollProgress";
import Effects from "../components/Effects";
import HeroScene from "../components/HeroScene";
import Expertise from "../components/Expertise";
import WorkExplorer from "../components/WorkExplorer";
import Toasts from "../components/Toast";
import BackToTop from "../components/BackToTop";
import CommandPalette from "../components/CommandPalette";
import ConsentBanner from "../components/Consent";
import Faq from "../components/Faq";
import { Hero, CredibilityBar, About, Experience, Services, Process, Journey, Contact, Footer } from "../components/Sections";

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <section className="hero" aria-label="Introduction"><HeroScene /><Hero /></section>
        <CredibilityBar />
        <section id="about" aria-label="About"><About /></section>
        <section id="expertise" aria-label="Expertise" style={{ paddingTop: 0 }}><Expertise /></section>
        <section id="work" aria-label="Selected work" style={{ paddingTop: 0 }}><WorkExplorer /></section>
        <section id="experience" aria-label="Experience" style={{ paddingTop: 0 }}><Experience /></section>
        <section aria-label="Services" style={{ paddingTop: 0 }}><Services /></section>
        <section aria-label="Process" style={{ paddingTop: 0 }}><Process /></section>
        <section aria-label="Background" style={{ paddingTop: 0 }}><Journey /></section>
        <section aria-label="Frequently asked questions" style={{ paddingTop: 0 }}><Faq /></section>
        <section aria-label="Contact"><Contact /></section>
      </main>
      <Footer />
      <Reveal />
      <SpringScroll />
      <Effects />
      <Toasts />
      <BackToTop />
      <CommandPalette />
      <ConsentBanner />
    </>
  );
}
