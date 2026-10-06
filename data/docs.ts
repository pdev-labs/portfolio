export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type DocSection = { heading: string; body: string[]; code?: string; note?: string };
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
  {
    slug: "fluxmedia",
    title: "FluxMedia setup guide",
    summary: "Download, stream, and share media over LAN with the PyPI package.",
    repo: "https://github.com/pdev-labs/FluxMedia",
    sections: [
      {
        heading: "Install",
        body: [
          "You need Python 3. The package installs from PyPI, and the cross-platform install.py resolves system dependencies through winget, brew, pkg, or your Linux package manager.",
          "Post-processing needs FFmpeg on PATH for audio extraction, merging, and artwork embedding.",
        ],
        code: "pip install fluxmedia",
      },
      {
        heading: "Download",
        body: [
          "The extraction core handles single videos, playlists, audio streams, channels, and subtitles. Pick a quality bucket and downloads fall back to best available instead of failing when a bucket is empty.",
          "Manage everything from the terminal dashboard or the React web UI, which also drives remote downloads from your phone.",
        ],
      },
      {
        heading: "Share over LAN",
        body: [
          "The built-in gateway serves your files over HTTP with password protection and a QR code, so any device on the same network can browse and play without accounts.",
          "Sync Play keeps playback in step across connected devices for local watch parties. It is marked beta, so expect rough edges on slow networks.",
        ],
      },
      {
        heading: "Keep it updated",
        body: [
          "The plugin manager lists extractors in a table with enable, disable, run, and search. Update checks run on a schedule you choose (daily, weekly, monthly, or never), and any prompt offers to ignore that version.",
        ],
        note: "Download only media you own or that is licensed for downloading. FluxMedia is a tool; what you fetch with it is your responsibility.",
      },
    ],
  },
  {
    slug: "nanonas-s3",
    title: "NanoNAS-S3 setup guide",
    summary: "Turn an ESP32-S3 into a wireless NAS with a Material web UI.",
    repo: "https://github.com/pdev-labs/NanoNAS-S3",
    sections: [
      {
        heading: "Hardware",
        body: [
          "Any ESP32-S3 dev board works. For full capacity choose 8 MB PSRAM with 16 MB flash, which the flasher turns into a large storage partition.",
          "You also need a micro-USB cable for the first flash and a 2.4 GHz Wi-Fi network the board can join.",
        ],
      },
      {
        heading: "Flash",
        body: [
          "Clone the repo, copy the secrets template, and fill in your Wi-Fi networks plus the admin login for the web interface.",
          "The flasher detects the serial port, configures PSRAM, and generates the 16 MB partition table when you select that flash size.",
        ],
        code: "git clone https://github.com/pdev-labs/NanoNAS-S3.git\ncd NanoNAS-S3\ncp secrets.h.example secrets.h\npython flasher.py",
        note: "secrets.h holds real Wi-Fi passwords. Never commit it or paste it into issues.",
      },
      {
        heading: "Use the NAS",
        body: [
          "Watch the serial monitor for the board's IP address, then open it in any browser on the same network and log in as admin.",
          "Upload files or whole folders by drag and drop, manage them with copy, move, rename, and delete, and check the analytics modal for a storage breakdown by file type.",
          "Create guest users from Settings for family or friends. Guests can read and play but cannot modify or delete.",
        ],
      },
      {
        heading: "Maintain",
        body: [
          "Configure several Wi-Fi networks and the board joins the strongest one automatically.",
          "Push firmware updates over the air straight from the web interface once the board is on your network.",
        ],
      },
    ],
  },
  {
    slug: "polystream",
    title: "Polystream install guide",
    summary: "Multi-tab video streaming without auto-pause or device lockouts.",
    repo: "https://github.com/pdev-labs/polystream",
    sections: [
      {
        heading: "How it works",
        body: [
          "Course portals and streaming sites enforce one active tab through visibility signals, heartbeats, locks, and server kick messages. Polystream intercepts all of these client-side so every tab believes it is the active one.",
          "It ships as a Manifest V3 extension for Firefox and Chrome, plus a one-file userscript for script managers and mobile browsers.",
        ],
      },
      {
        heading: "Install the userscript",
        body: [
          "Install Violentmonkey or Tampermonkey in your browser. Kiwi and Orion bring the same support to mobile.",
          "Create a new script in the manager dashboard, paste the full contents of multi-tab-enabler.user.js from the repo, and save. No build step and no permissions dialog beyond the manager itself.",
        ],
        note: "This bypasses restrictions that platforms put in deliberately. Check your course or streaming service terms and only use it with content you are entitled to watch.",
      },
      {
        heading: "Install the extension",
        body: [
          "Clone the repo, open the extensions page (chrome://extensions or edge://extensions), enable Developer mode, and load the project folder unpacked.",
          "The extension updates when you pull the repo, which suits desktops where you already live in a Chromium browser.",
        ],
        code: "git clone https://github.com/pdev-labs/polystream.git",
      },
      {
        heading: "Verify",
        body: [
          "Open the same portal in two tabs and start both videos. Both keep playing when you switch tabs, with no lockout dialog.",
          "Spacebar and click controls still work normally. Only programmatic background pauses are blocked.",
        ],
      },
    ],
  },
  {
    slug: "stepsnap",
    title: "StepSnap usage guide",
    summary: "Background screenshots that document your workflow into Markdown.",
    repo: "https://github.com/pdev-labs/StepSnap",
    sections: [
      {
        heading: "Install",
        body: [
          "StepSnap runs on Windows, macOS, and Linux (X11 and Wayland). Use a virtual environment to keep dependencies isolated.",
          "On Debian or Ubuntu install the evdev system library first. Arch users take python-evdev from pacman.",
        ],
        code: "git clone https://github.com/pdev-labs/StepSnap.git\ncd StepSnap\npython -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt",
      },
      {
        heading: "Record",
        body: [
          "Run the recorder and work normally. Every click and Enter keypress captures a screenshot with a one-second throttle against double-clicks.",
          "Press F9 any time to pause and resume. Name the session up front or accept the timestamped default folder.",
          "As you work, StepSnap appends each step to steps.md, ready to paste straight into a pull request or issue.",
        ],
        code: "python stepsnap.py",
        note: "Screenshots can capture tokens and private tabs. Review the folder before posting it anywhere public. On Wayland the process needs input group membership for evdev.",
      },
      {
        heading: "Publish",
        body: [
          "Open steps.md, check the images in order, and paste the whole file into GitHub. Relative image paths resolve once the folder ships alongside the Markdown.",
          "For tutorials, record once per feature and keep the raw folders. Re-recording a single changed step beats re-recording everything.",
        ],
      },
    ],
  },
  {
    slug: "controller",
    title: "Controller setup guide",
    summary: "Use an Android phone as a gamepad, keyboard, and mouse over Wi-Fi.",
    repo: "https://github.com/pdev-labs/controller",
    sections: [
      {
        heading: "Install the host",
        body: [
          "Grab the build for your OS from the Releases page: installer for Windows, AppImage or deb for Linux, dmg for macOS.",
          "Windows may ask firewall permission on first launch. Linux asks for the root password once to configure uinput for the virtual Xbox controller.",
        ],
      },
      {
        heading: "Connect the phone",
        body: [
          "Join the same Wi-Fi on phone and computer. Open the address the host shows (port 8080) in the phone browser and enter the PIN for first pairing.",
          "Inputs travel over a WebSocket on port 8081 with low enough latency for real games. Rearrange the pad in the layout editor and switch themes without reconnecting.",
        ],
        note: "Phone and computer must stay on the same network. Guest or client-isolated Wi-Fi networks block the connection.",
      },
      {
        heading: "Per-OS behavior",
        body: [
          "Linux and Windows expose a full virtual Xbox 360 controller through uinput and ViGEmBus, so games detect a real gamepad.",
          "macOS blocks virtual gamepads, so the phone maps to keyboard and mouse instead. Configure the game for keyboard controls and everything still plays.",
          "Gyro aiming, haptics, and the fast-forward key work on all three platforms.",
        ],
      },
    ],
  },
];
