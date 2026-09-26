export const FAQS: [string, string][] = [
  ['How do I contact you?',
   'Fastest is GitHub — open an issue or discussion on any repo and I reply within 48 hours. You can also email pdev.labs@gmail.com or message @pdev_labs on Instagram.'],
  ['Are you available for work?',
   'Yes — open-source collaborations and internships. See the Experience section for what I can contribute on day one.'],
  ['Can I use your projects?',
   "Yes. Everything is open source; check each repo's LICENSE — pdev is GPLv3. Star or fork on GitHub."],
  ['How do I install Linux on my Android phone?',
   'Use Linux-For-Android: install Termux, run the installer, pick Ubuntu, Debian, Arch, Fedora, or Void. Full steps are in the repo README.'],
  ['What is the pdev programming language?',
   'A Hinglish programming language written in Python for first-time coders — you write likho("namaste") instead of print. Try it in the terminal above or read the source on GitHub.'],
  ['Do you test on real hardware?',
   'Yes. ESP32-S3 boards for firmware, real phones via Termux for Linux installers, and LAN devices for FluxMedia — nothing ships untested.'],
];

export default function Faq() {
  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">FAQ</p>
          <h2>Questions, answered.</h2>
        </div>
      </div>
      <div className="faq-list">
        <details className="faq-item reveal" key={0}>
          <summary>How do I contact you?</summary>
          <p>Fastest is GitHub — open an issue or discussion on any repo and I reply within 48 hours. You can also email pdev.labs@gmail.com or message @pdev_labs on Instagram.</p>
        </details>
        <details className="faq-item reveal" key={1}>
          <summary>Are you available for work?</summary>
          <p>Yes — open-source collaborations and internships. See the Experience section for what I can contribute on day one.</p>
        </details>
        <details className="faq-item reveal" key={2}>
          <summary>Can I use your projects?</summary>
          <p>Yes. Everything is open source; check each repo's LICENSE — pdev is GPLv3. Star or fork on GitHub.</p>
        </details>
        <details className="faq-item reveal" key={3}>
          <summary>How do I install Linux on my Android phone?</summary>
          <p>Use Linux-For-Android: install Termux, run the installer, pick Ubuntu, Debian, Arch, Fedora, or Void. Full steps are in the repo README.</p>
        </details>
        <details className="faq-item reveal" key={4}>
          <summary>What is the pdev programming language?</summary>
          <p>A Hinglish programming language written in Python for first-time coders — you write likho("namaste") instead of print. Try it in the terminal above or read the source on GitHub.</p>
        </details>
        <details className="faq-item reveal" key={5}>
          <summary>Do you test on real hardware?</summary>
          <p>Yes. ESP32-S3 boards for firmware, real phones via Termux for Linux installers, and LAN devices for FluxMedia — nothing ships untested.</p>
        </details>
      </div>
    </div>
  );
}
