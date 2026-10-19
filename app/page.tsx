import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import SpringScroll from "../components/SpringScroll";
import ScrollProgress from "../components/ScrollProgress";
import Effects from "../components/Effects";
import HeroScene from "../components/HeroScene";
import HeroVideo from "../components/HeroVideo";
import Atmos from "../components/Atmos";
import Plate from "../components/Plate";
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
        <section id="about" className="cine" aria-label="About"><Plate src="/media/plates/about.webp" opacity={0.6} /><About /></section>
        <section id="expertise" className="cine" aria-label="Expertise"><Plate src="/media/plates/expertise.webp" opacity={0.42} parallax={22} /><Expertise /></section>
        <section id="work" className="cine" aria-label="Selected work"><Plate src="/media/plates/work.webp" opacity={0.38} parallax={22} /><WorkExplorer /></section>
        <section id="experience" className="cine" aria-label="Experience"><Plate src="/media/plates/experience.webp" opacity={0.4} /><Experience overview={exp.overview} months={exp.months} /></section>
        <section className="cine" aria-label="Services"><Plate src="/media/plates/services.webp" opacity={0.38} /><Services /></section>
        <section className="cine" aria-label="Process"><Plate src="/media/plates/process.webp" opacity={0.38} /><Process /></section>
        <section className="cine" aria-label="Background"><Plate src="/media/plates/journey.webp" opacity={0.4} /><Journey /></section>
        <section aria-label="Frequently asked questions"><Faq /></section>
        <section className="cine" aria-label="Contact"><Plate src="/media/plates/contact.webp" opacity={0.5} /><Contact /></section>
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
