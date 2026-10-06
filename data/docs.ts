export type DocSection = { heading: string; body: string[]; code?: string };
export type Doc = {
  slug: string;
  title: string;
  summary: string;
  repo: string;
  sections: DocSection[];
};

export const DOCS: Doc[] = [
  {
    slug: "linux-for-android",
    title: "Linux-For-Android install guide",
    summary: "Full Linux desktop on Android via Termux: install, boot, and fix the common pitfalls.",
    repo: "https://github.com/pdev-labs/Linux-For-Android",
    sections: [
      {
        heading: "What you need",
        body: [
          "An Android phone and Termux installed from F-Droid. Do not use the Play Store build of Termux, it is outdated and breaks the installer.",
          "About 4 GB of free storage for a comfortable desktop distro, plus a Wi-Fi connection for the first install.",
        ],
      },
      {
        heading: "Install",
        body: [
          "Paste this into Termux. The script walks you through distro choice, display settings, and user setup:",
        ],
        code: "pkg update -y && pkg install git -y\ngit clone https://github.com/pdev-labs/Linux-For-Android.git\ncd Linux-For-Android\nchmod +x install_linux.sh\n./install_linux.sh",
      },
      {
        heading: "Pick a distro",
        body: [
          "Ubuntu and Debian suit first-timers. Arch and Void suit minimal setups. Kali suits security tooling. Fedora and OpenSUSE sit in the middle.",
          "Choose VNC for maximum compatibility or Termux:X11 for smoother hardware-accelerated graphics. Pick 720p on small phones, 1080p on large ones.",
        ],
      },
      {
        heading: "Daily use",
        body: [
          "After setup you never run the installer again. Boot with start-linux, shut everything down cleanly with stop-linux. With several distros installed, the boot menu asks which one to start.",
          "Default login is user ubuntu for both sudo and VNC. Change it on first boot.",
          "The manager menu also handles updates, SSH on port 8022, audio fixes, and portable .tar.gz exports you can share with friends.",
        ],
        code: "start-linux   # boot (asks which distro if several)\nstop-linux    # stop desktop, display and audio",
      },
      {
        heading: "Troubleshooting",
        body: [
          "Termux killed with signal 9 on Android 12 and later: this is the phantom process killer. Enable Developer options and turn off the background process limit, or keep Termux in the foreground during heavy tasks.",
          "No audio: run the audio fixer from the manager menu, it restarts PulseAudio bound to TCP.",
          "Black screen on connect: stop-linux, then boot again and re-check the VNC address and password shown in Termux.",
        ],
      },
    ],
  },
  {
    slug: "lazy-esp32",
    title: "Lazy-ESP32 usage guide",
    summary: "Compile, flash, and manage ESP32 projects from one interactive menu.",
    repo: "https://github.com/pdev-labs/Lazy-ESP32",
    sections: [
      {
        heading: "What you need",
        body: [
          "A Linux machine with Python 3, arduino-cli, and esptool installed, plus an ESP32 board on USB. The bundled install.sh script configures arduino-cli board URLs, installs pyserial, and adds a lazy_esp alias.",
        ],
        code: "git clone https://github.com/pdev-labs/Lazy-ESP32.git\ncd Lazy-ESP32\nchmod +x install.sh\n./install.sh",
      },
      {
        heading: "Basic workflow",
        body: [
          "Open a terminal in any folder containing a .ino sketch and run the toolkit. It auto-detects the sketch and the connected module, then offers flashing, compiling, recovery, and diagnostics from one menu.",
          "Sketches compile in a temporary sandbox, so your project folder no longer needs to match the .ino filename.",
        ],
        code: "python lazy_esp.py",
      },
      {
        heading: "Partitions and web assets",
        body: [
          "Use the partition manager before flashing web servers: it detects your chip's flash size and writes a custom partitions.csv with the app and LittleFS split you choose.",
          "Switching partition sizes injects a clean build automatically, which avoids the classic undefined reference to app_main linker failure from stale cache.",
          "The web assets converter turns a folder of HTML, CSS, and JS into a PROGMEM C++ header, then packs the data folder to LittleFS on flash.",
        ],
      },
      {
        heading: "Wireless and serial",
        body: [
          "OTA flashing pushes firmware over Wi-Fi with no cable. The serial monitor is a thin wrapper over pyserial for watching boot logs and crashes.",
          "Back up the current firmware before experimental flashes, and use the board info option to confirm flash size before slicing partitions.",
        ],
      },
    ],
  },
];
