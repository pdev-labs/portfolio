import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import SpringScroll from "../components/SpringScroll";
import ScrollProgress from "../components/ScrollProgress";
import Effects from "../components/Effects";
import HeroScene from "../components/HeroScene";
import HeroVideo from "../components/HeroVideo";
import Atmos from "../components/Atmos";
import Expertise from "../components/Expertise";
import Experience from "../components/Experience";
import WorkExplorer from "../components/WorkExplorer";
import Toasts from "../components/Toast";
import BackToTop from "../components/BackToTop";
import CommandPalette from "../components/CommandPalette";
import ConsentBanner from "../components/Consent";
import Faq from "../components/Faq";
import { Hero, CredibilityBar, About, Services, Process, Journey, Contact, Footer } from "../components/Sections";
import { getExperience } from "../lib/experience";

export default async function Page() {
  const exp = await getExperience();
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <section className="hero" aria-label="Introduction"><HeroVideo /><HeroScene /><Hero /></section>
        <CredibilityBar />
        <section id="about" aria-label="About"><About /></section>
        <section id="expertise" aria-label="Expertise" style={{ paddingTop: 0 }}><Expertise /></section>
        <section id="work" aria-label="Selected work" style={{ paddingTop: 0 }}><WorkExplorer /></section>
        <section id="experience" aria-label="Experience" style={{ paddingTop: 0 }}><Experience overview={exp.overview} months={exp.months} /></section>
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
      <Atmos />
      <Toasts />
      <BackToTop />
      <CommandPalette />
      <ConsentBanner />
    </>
  );
}
