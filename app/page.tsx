import Nav from "../components/Nav";
import SpringScroll from "../components/SpringScroll";
import ScrollProgress from "../components/ScrollProgress";
import Effects from "../components/Effects";
import Motion from "../components/Motion";
import Marquee from "../components/Marquee";
import Preloader from "../components/Preloader";
import LabConsole from "../components/LabConsole";
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
      <Preloader />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <section className="hero" aria-label="Introduction"><Hero /></section>
        <Marquee items={["Linux on Android", "ESP32 firmware", "Python tooling", "LAN media", "Browser extensions", "Systems software"]} />

        <section className="term-band" aria-label="Interactive shell">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <p className="sec-label">shell</p>
                <h2>Try the toolkit.</h2>
                <p>A working shell in the browser — 28 commands, history, tab-complete.</p>
              </div>
            </div>
            <LabConsole />
          </div>
        </section>

        <CredibilityBar />
        <section id="about" aria-label="About"><About /></section>
        <section id="expertise" aria-label="Expertise"><Expertise /></section>
        <section id="work" aria-label="Selected work"><WorkExplorer /></section>
        <section id="experience" aria-label="Experience"><Experience overview={exp.overview} months={exp.months} /></section>
        <section aria-label="Services"><Services /></section>
        <section aria-label="Process"><Process /></section>
        <section aria-label="Background"><Journey /></section>
        <section aria-label="Frequently asked questions"><Faq /></section>
        <section aria-label="Contact"><Contact /></section>
      </main>
      <Footer />
      <SpringScroll />
      <Effects />
      <Motion />
      <Toasts />
      <BackToTop />
      <CommandPalette />
      <ConsentBanner />
    </>
  );
}
