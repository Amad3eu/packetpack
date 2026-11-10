// The catalog. Every spec here should be traceable to the manufacturer's own docs
// (linked in `docs`). When unsure, leave a spec out rather than guess: see CONTRIBUTING.md.

export type Category =
  | "Multi-tool"
  | "Microcontroller"
  | "Single-board computer"
  | "Wireless"
  | "USB & HID"
  | "Network"
  | "Radio (SDR)"
  | "RFID & NFC"
  | "Authentication";

export type Difficulty = 1 | 2 | 3;

export type Link = { label: string; url: string };

export type Project = {
  title: string;
  summary: string;
  difficulty: Difficulty;
};

export type Equipment = {
  slug: string;
  name: string;
  manufacturer: string;
  category: Category;
  tagline: string;
  description: string;
  website: string;
  docs: string;
  github: Link[];
  community: Link[];
  specs: { label: string; value: string }[];
  protocols: string[];
  educational: string[];
  defensive: string[];
  authorized: string[];
  difficulty: Difficulty;
  price: string;
  /** Set when the maker retired or replaced the product, so nobody buys from a stale page. */
  status?: string;
  projects: Project[];
  related: string[];
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

export const equipment: Equipment[] = [
  {
    slug: "flipper-zero",
    name: "Flipper Zero",
    manufacturer: "Flipper Devices",
    category: "Multi-tool",
    tagline: "A pocket multi-tool for exploring the radio world around you.",
    description:
      "A handheld, open-source device that reads, stores and emulates common short-range signals: sub-GHz radio, 125 kHz RFID, NFC, infrared and iButton. Its friendly UI and plugin ecosystem make it a popular first step into hardware and radio concepts.",
    website: "https://flipper.net",
    docs: "https://docs.flipper.net",
    github: [
      { label: "Official firmware", url: "https://github.com/flipperdevices/flipperzero-firmware" },
    ],
    community: [{ label: "Official forum", url: "https://forum.flipper.net" }],
    specs: [
      { label: "MCU", value: "STM32WB55 (Cortex-M4 app core + Cortex-M0+ radio core)" },
      { label: "Display", value: "1.4\" monochrome LCD, 128×64" },
      { label: "Sub-GHz", value: "CC1101 transceiver, region-locked bands" },
      { label: "Other radios", value: "125 kHz RFID, 13.56 MHz NFC, Bluetooth LE 5.4, infrared" },
      { label: "Expansion", value: "GPIO header, microSD slot, USB-C" },
      { label: "Battery", value: "2100 mAh LiPo" },
    ],
    protocols: ["Sub-GHz", "RFID 125 kHz", "NFC", "Infrared", "1-Wire / iButton", "Bluetooth LE", "GPIO"],
    educational: [
      "See how contactless cards, remotes and IR devices encode data.",
      "Learn embedded development through the plugin (FAP) SDK.",
    ],
    defensive: [
      "Check which of your own access badges are easy to read and copy.",
      "Show non-technical colleagues why legacy 125 kHz badges are weak.",
    ],
    authorized: ["Physical-access assessments where badge testing is in the written scope."],
    difficulty: 1,
    price: "≈ US$169 (official US store; varies by region)",
    projects: [
      { title: "RFID & NFC fundamentals", summary: "Read your own badges and transit cards and compare what each technology stores.", difficulty: 1 },
      { title: "Universal remote for your own devices", summary: "Capture and replay the IR codes of your TV and air conditioner.", difficulty: 1 },
      { title: "GPIO sensor experiments", summary: "Wire a temperature sensor to the GPIO header and display readings.", difficulty: 2 },
      { title: "Sub-GHz radio concepts", summary: "Observe your own weather station or doorbell and learn about modulation.", difficulty: 2 },
    ],
    related: ["proxmark3", "m5stack-cardputer", "hackrf-one"],
  },
  {
    slug: "m5stack-cardputer",
    name: "M5Stack Cardputer",
    manufacturer: "M5Stack",
    category: "Microcontroller",
    tagline: "A credit-card computer with a real keyboard.",
    description:
      "A tiny ESP32-S3 computer with a 56-key keyboard, colour screen, speaker, microphone and IR emitter. It runs Arduino, MicroPython or UIFlow programs, which makes it a great portable lab for Wi-Fi and BLE experiments.",
    website: "https://docs.m5stack.com/en/core/Cardputer",
    docs: "https://docs.m5stack.com/en/core/Cardputer",
    github: [{ label: "M5Cardputer library", url: "https://github.com/m5stack/M5Cardputer" }],
    community: [{ label: "M5Stack community", url: "https://community.m5stack.com" }],
    specs: [
      { label: "Controller", value: "ESP32-S3 (StampS3 on v1.0; Stamp-S3A on v1.1 and Cardputer-Adv)" },
      { label: "Display", value: "1.14\" IPS LCD, 240×135" },
      { label: "Input", value: "56-key keyboard" },
      { label: "I/O", value: "IR emitter, mic, speaker, microSD, Grove port" },
      { label: "Wireless", value: "2.4 GHz Wi-Fi, Bluetooth LE" },
    ],
    protocols: ["Wi-Fi 2.4 GHz", "Bluetooth LE", "Infrared", "I²C (Grove)"],
    educational: [
      "Write firmware for a complete device with screen, keyboard and audio.",
      "Learn Wi-Fi and BLE APIs on the ESP32-S3.",
    ],
    defensive: ["Build a pocket scanner that lists the devices on your own network."],
    authorized: ["Portable test console for scoped wireless assessments."],
    difficulty: 1,
    price: "≈ US$30–40",
    projects: [
      { title: "Portable information display", summary: "Show weather, calendar or server status pulled from your own APIs.", difficulty: 1 },
      { title: "Bluetooth LE explorer", summary: "List nearby BLE advertisements and decode what your own gadgets broadcast.", difficulty: 2 },
      { title: "Wi-Fi diagnostic dashboard", summary: "Measure signal strength and channel use of your home network.", difficulty: 2 },
    ],
    related: ["m5stickc-plus2", "esp32-marauder", "flipper-zero"],
  },
  {
    slug: "m5stickc-plus2",
    name: "M5StickC Plus2",
    manufacturer: "M5Stack",
    category: "Microcontroller",
    tagline: "A thumb-sized ESP32 with a screen and a battery.",
    description:
      "A compact ESP32 development kit with a colour screen, IMU, microphone, IR emitter, buzzer and real-time clock. It is a cheap, self-contained way to learn embedded programming and wireless basics.",
    website: "https://docs.m5stack.com/en/core/M5StickC%20PLUS2",
    docs: "https://docs.m5stack.com/en/core/M5StickC%20PLUS2",
    github: [{ label: "M5StickCPlus2 library", url: "https://github.com/m5stack/M5StickCPlus2" }],
    community: [{ label: "M5Stack community", url: "https://community.m5stack.com" }],
    specs: [
      { label: "SoC", value: "ESP32-PICO-V3-02" },
      { label: "Display", value: "1.14\" TFT, 135×240" },
      { label: "Sensors", value: "6-axis IMU, microphone, RTC" },
      { label: "I/O", value: "IR emitter, buzzer, Grove port, 3 buttons" },
      { label: "Battery", value: "200 mAh" },
    ],
    protocols: ["Wi-Fi 2.4 GHz", "Bluetooth", "Infrared", "I²C (Grove)"],
    educational: ["Learn sensors, deep sleep and battery management on a real device."],
    defensive: ["Prototype a simple alert badge that warns when your home network drops."],
    authorized: ["Small, inexpensive target device for practising firmware analysis in a lab."],
    difficulty: 1,
    price: "≈ US$20–25",
    projects: [
      { title: "Environmental monitor", summary: "Add a Grove sensor and log temperature and humidity over Wi-Fi.", difficulty: 1 },
      { title: "Motion-controlled presenter", summary: "Use the IMU and BLE HID to change slides on your own laptop.", difficulty: 2 },
    ],
    related: ["m5stack-cardputer", "esp32-marauder"],
  },
  {
    slug: "esp32-marauder",
    name: "ESP32 Marauder",
    manufacturer: "JustCallMeKoko (open-source project)",
    category: "Wireless",
    tagline: "Open-source Wi-Fi and Bluetooth analysis firmware for the ESP32.",
    description:
      "A firmware suite that turns ESP32 boards into a Wi-Fi and Bluetooth analysis tool: scanning access points and stations, sniffing frames and saving captures to PCAP for Wireshark. It runs on many boards, including dedicated Marauder kits and Wi-Fi add-ons for the Flipper Zero.",
    website: "https://github.com/justcallmekoko/ESP32Marauder",
    docs: "https://github.com/justcallmekoko/ESP32Marauder/wiki",
    github: [{ label: "ESP32Marauder", url: "https://github.com/justcallmekoko/ESP32Marauder" }],
    community: [{ label: "Wireshark (open the captures)", url: "https://www.wireshark.org" }],
    specs: [
      { label: "Runs on", value: "ESP32-family boards (several supported targets)" },
      { label: "Bands", value: "2.4 GHz Wi-Fi and BLE on most boards; 5 GHz on ESP32-C5 targets" },
      { label: "Output", value: "PCAP files to microSD on boards that have it" },
    ],
    protocols: ["Wi-Fi 2.4 GHz (802.11)", "Bluetooth LE", "PCAP"],
    educational: [
      "See real 802.11 management frames: beacons, probe requests, authentication.",
      "Learn how to read packet captures in Wireshark.",
    ],
    defensive: [
      "Audit which networks and devices are visible around your home or lab.",
      "Spot unexpected access points that imitate your own network's name.",
    ],
    authorized: ["Wireless surveys and audits inside a written scope of engagement."],
    difficulty: 2,
    price: "Firmware is free; hardware varies (a few dollars DIY to dedicated kits)",
    projects: [
      { title: "Wi-Fi survey of your home", summary: "Map channels and congestion and pick the best channel for your router.", difficulty: 1 },
      { title: "Your first packet capture", summary: "Capture your own network's beacons to PCAP and read them in Wireshark.", difficulty: 2 },
      { title: "Rogue access point detection", summary: "Alert when an AP advertises your SSID with an unknown BSSID.", difficulty: 3 },
    ],
    related: ["m5stack-cardputer", "wifi-pineapple", "flipper-zero"],
  },
  {
    slug: "raspberry-pi",
    name: "Raspberry Pi 5",
    manufacturer: "Raspberry Pi Ltd",
    category: "Single-board computer",
    tagline: "A full Linux computer the size of a deck of cards.",
    description:
      "The flagship Raspberry Pi: a quad-core ARM computer with GPIO, PCIe and dual displays. It is the backbone of countless home labs, from network monitors to portable Linux workstations and cyberdecks.",
    website: "https://www.raspberrypi.com/products/raspberry-pi-5/",
    docs: "https://www.raspberrypi.com/documentation/",
    github: [{ label: "Raspberry Pi on GitHub", url: "https://github.com/raspberrypi" }],
    community: [{ label: "Official forums", url: "https://forums.raspberrypi.com" }],
    specs: [
      { label: "SoC", value: "Broadcom BCM2712, quad-core Cortex-A76 @ 2.4 GHz" },
      { label: "Memory", value: "Several LPDDR4X options (from 1 GB up to 16 GB)" },
      { label: "Networking", value: "Gigabit Ethernet, dual-band Wi-Fi, Bluetooth 5.0" },
      { label: "I/O", value: "2× USB 3.0, 2× USB 2.0, 2× micro-HDMI, PCIe 2.0 x1, 40-pin GPIO" },
    ],
    protocols: ["Ethernet", "Wi-Fi", "Bluetooth", "GPIO / I²C / SPI / UART", "PCIe"],
    educational: [
      "Learn Linux administration on hardware you can't break.",
      "Practise networking: DNS, DHCP, VPNs and firewalls.",
    ],
    defensive: [
      "Run network-wide DNS filtering and monitoring at home.",
      "Host an intrusion-detection sensor on a mirrored switch port.",
    ],
    authorized: ["Drop-in Linux box for internal assessments with written approval."],
    difficulty: 1,
    price: "From ≈ US$45 (1 GB); larger-RAM models rose sharply in 2026 (16 GB ≈ US$385). Check official resellers.",
    projects: [
      { title: "Portable Linux workstation", summary: "Build a small cyberdeck with a screen, keyboard and battery.", difficulty: 2 },
      { title: "Home network monitor", summary: "Watch DNS queries and device traffic on your own network.", difficulty: 2 },
      { title: "Cybersecurity learning lab", summary: "Host intentionally vulnerable apps on an isolated network to practise safely.", difficulty: 3 },
      { title: "Local home server", summary: "Self-host files, a wiki and backups.", difficulty: 1 },
    ],
    related: ["lan-turtle", "packet-squirrel", "rtl-sdr-v4"],
  },
  {
    slug: "wifi-pineapple",
    name: "WiFi Pineapple",
    manufacturer: "Hak5",
    category: "Wireless",
    tagline: "A wireless auditing platform with a web interface.",
    description:
      "A family of purpose-built wireless auditing devices with multiple radios and a browser-based dashboard. Security teams use it to assess Wi-Fi deployments and to show how clients react to look-alike networks, always inside an authorized scope.",
    website: "https://shop.hak5.org",
    docs: "https://documentation.hak5.org/wifi-pineapple/",
    github: [{ label: "Community modules", url: "https://github.com/hak5/wifipineapple-modules" }],
    community: [{ label: "Hak5 community", url: "https://hak5.org/community" }],
    specs: [
      { label: "Radios", value: "Multiple dedicated Wi-Fi radios (varies by model)" },
      { label: "Interface", value: "Web dashboard and modules" },
      { label: "Models", value: "Mark VII, Enterprise, Pager" },
    ],
    protocols: ["Wi-Fi (802.11)", "Ethernet", "USB"],
    educational: [
      "Understand how Wi-Fi clients choose and roam between access points.",
      "Study Wi-Fi infrastructure, channels and security modes.",
    ],
    defensive: [
      "Learn the signals that reveal rogue access points so you can detect them.",
      "Validate that your corporate devices refuse open look-alike networks.",
    ],
    authorized: ["Wireless security assessments with a signed scope and rules of engagement."],
    difficulty: 3,
    price: "≈ US$250–320, Enterprise more (check the Hak5 shop)",
    projects: [
      { title: "Wireless network security basics", summary: "In a lab with your own AP, compare WPA2, WPA3 and open networks.", difficulty: 2 },
      { title: "Rogue AP detection and defense", summary: "Set up a test look-alike AP in a lab and tune your monitoring to catch it.", difficulty: 3 },
      { title: "Authorized wireless audit report", summary: "Practise writing a professional audit report from a lab engagement.", difficulty: 3 },
    ],
    related: ["esp32-marauder", "ubertooth-one", "packet-squirrel"],
  },
  {
    slug: "bash-bunny",
    name: "Bash Bunny",
    manufacturer: "Hak5",
    category: "USB & HID",
    tagline: "A Linux computer that can present itself as many USB devices.",
    description:
      "A USB-attached Linux computer that can emulate a keyboard, network adapter, serial port or flash drive, selected by a physical switch. It's a hands-on way to learn how operating systems trust USB devices.",
    website: "https://shop.hak5.org",
    docs: "https://documentation.hak5.org/bash-bunny/",
    github: [{ label: "Payload library", url: "https://github.com/hak5/bashbunny-payloads" }],
    community: [{ label: "Hak5 community", url: "https://hak5.org/community" }],
    specs: [
      { label: "Platform", value: "Embedded Linux on a quad-core ARM" },
      { label: "USB modes", value: "HID keyboard, Ethernet, serial, mass storage" },
      { label: "Controls", value: "Multi-position payload switch, RGB status LED" },
      { label: "Mark II extras", value: "microSD slot, Bluetooth LE" },
    ],
    protocols: ["USB HID", "USB Ethernet (RNDIS/ECM)", "USB serial", "USB mass storage"],
    educational: [
      "Learn USB device classes and how hosts enumerate them.",
      "Understand why operating systems trust keyboards by default.",
    ],
    defensive: [
      "Test whether your USB device-control policy actually blocks new devices.",
      "Train staff to recognise unknown USB devices.",
    ],
    authorized: ["Physical and endpoint security tests on in-scope machines."],
    difficulty: 3,
    price: "≈ US$200 for the Mark II (check the Hak5 shop)",
    projects: [
      { title: "USB device class explorer", summary: "On a dedicated test machine, watch how the OS enumerates each mode.", difficulty: 2 },
      { title: "Endpoint policy check", summary: "Verify on a lab laptop that your USB allow-list blocks unknown devices.", difficulty: 3 },
    ],
    related: ["usb-rubber-ducky", "omg-cable", "lan-turtle"],
  },
  {
    slug: "usb-rubber-ducky",
    name: "USB Rubber Ducky",
    manufacturer: "Hak5",
    category: "USB & HID",
    tagline: "A keystroke-injection tool that looks like a flash drive.",
    description:
      "A USB device that presents itself as a keyboard and types pre-written scripts written in DuckyScript. It is the classic demonstration of the USB HID trust problem, widely used in security awareness training and IT automation.",
    website: "https://shop.hak5.org",
    docs: "https://documentation.hak5.org/hak5-usb-rubber-ducky/",
    github: [{ label: "Payload library", url: "https://github.com/hak5/usbrubberducky-payloads" }],
    community: [{ label: "Hak5 community", url: "https://hak5.org/community" }],
    specs: [
      { label: "Language", value: "DuckyScript 3.0" },
      { label: "Connectors", value: "USB-A and USB-C (current model)" },
      { label: "Storage", value: "microSD for payloads" },
    ],
    protocols: ["USB HID", "USB mass storage"],
    educational: [
      "Learn USB HID fundamentals: why a keyboard is trusted on plug-in.",
      "Automate repetitive setup tasks on your own machines.",
    ],
    defensive: [
      "Demonstrate in awareness training why found USB drives are dangerous.",
      "Test keystroke-injection detection on endpoint tools in a lab.",
    ],
    authorized: ["Social-engineering and endpoint tests on in-scope machines."],
    difficulty: 2,
    price: "≈ US$80–100 (check the Hak5 shop)",
    projects: [
      { title: "USB HID fundamentals", summary: "On a dedicated test machine, script a harmless 'hello world' that opens a text editor.", difficulty: 1 },
      { title: "Controlled awareness demo", summary: "Build a demo for colleagues on an isolated laptop that shows the risk.", difficulty: 2 },
    ],
    related: ["bash-bunny", "omg-cable", "yubikey"],
  },
  {
    slug: "omg-cable",
    name: "O.MG Cable",
    manufacturer: "O.MG (sold by Hak5)",
    category: "USB & HID",
    tagline: "A USB cable with a hidden implant, built to show hardware-trust risk.",
    description:
      "A normal-looking USB cable with an implant that can act as a keyboard and is controlled over Wi-Fi. Its main lesson is about hardware supply chains: a cable is a computer you didn't know you plugged in.",
    website: "https://o.mg.lol",
    docs: "https://o.mg.lol",
    github: [{ label: "Payload library", url: "https://github.com/hak5/omg-payloads" }],
    community: [{ label: "Hak5 community", url: "https://hak5.org/community" }],
    specs: [
      { label: "Form factor", value: "USB cable (several connector variants)" },
      { label: "Control", value: "Web interface over its own Wi-Fi" },
      { label: "Editions", value: "Basic and Elite (more features)" },
    ],
    protocols: ["USB HID", "Wi-Fi 2.4 GHz"],
    educational: ["Understand supply-chain and hardware-trust risks."],
    defensive: [
      "Build a policy for cables and chargers in sensitive areas.",
      "Learn why USB data blockers and device-control policies matter.",
    ],
    authorized: ["Red-team engagements where implant testing is explicitly in scope."],
    difficulty: 3,
    price: "≈ US$150–220, depending on edition",
    projects: [
      { title: "Hardware trust workshop", summary: "Explain with a teardown photo series how a cable can hide a computer.", difficulty: 1 },
      { title: "Lab endpoint test", summary: "On a dedicated test machine, check what your endpoint tools log when a new HID appears.", difficulty: 3 },
    ],
    related: ["usb-rubber-ducky", "bash-bunny"],
  },
  {
    slug: "lan-turtle",
    name: "LAN Turtle",
    manufacturer: "Hak5",
    category: "Network",
    tagline: "A USB Ethernet adapter with a Linux system inside.",
    description:
      "Looks like a USB-to-Ethernet adapter but runs an embedded Linux with installable modules. Admins use it for remote access and network tasks; security teams use it to show how a small device on the network can be overlooked.",
    website: "https://shop.hak5.org",
    docs: "https://documentation.hak5.org/lan-turtle/",
    github: [{ label: "Modules", url: "https://github.com/hak5/lanturtle-modules" }],
    community: [{ label: "Hak5 community", url: "https://hak5.org/community" }],
    specs: [
      { label: "Form factor", value: "USB-A to RJ45 Ethernet adapter" },
      { label: "Platform", value: "Embedded Linux with a module framework" },
    ],
    protocols: ["Ethernet", "USB Ethernet", "SSH", "VPN"],
    educational: ["Learn how network adapters, bridging and remote shells work."],
    defensive: [
      "Test network access control: does an unknown device get an address?",
      "Practise finding unknown hosts on your own network.",
    ],
    authorized: ["Internal network assessments with explicit permission."],
    difficulty: 3,
    price: "≈ US$60–80 (check the Hak5 shop)",
    projects: [
      { title: "Find the hidden device", summary: "Plug it into your lab network and practise discovering it from the switch and DHCP logs.", difficulty: 2 },
    ],
    related: ["packet-squirrel", "raspberry-pi", "bash-bunny"],
  },
  {
    slug: "packet-squirrel",
    name: "Packet Squirrel",
    manufacturer: "Hak5",
    category: "Network",
    tagline: "A pocket-sized inline Ethernet tool for packet capture.",
    description:
      "Sits between two Ethernet devices and can capture traffic, tunnel it over a VPN or run scripted payloads. It is a hands-on way to learn what actually crosses a network cable.",
    website: "https://shop.hak5.org",
    docs: "https://documentation.hak5.org/packet-squirrel-mark-ii/",
    github: [{ label: "Payloads", url: "https://github.com/hak5/packetsquirrel-payloads" }],
    community: [{ label: "Hak5 community", url: "https://hak5.org/community" }],
    specs: [
      { label: "Ports", value: "Two Ethernet ports (inline), USB for storage" },
      { label: "Capture", value: "PCAP to USB storage" },
    ],
    protocols: ["Ethernet", "PCAP", "VPN"],
    educational: ["See plaintext vs. encrypted protocols on your own network."],
    defensive: [
      "Show why unencrypted protocols on a LAN are a risk.",
      "Use 802.1X / port security to see the device get blocked.",
    ],
    authorized: ["Network assessments with physical access in scope."],
    difficulty: 2,
    price: "≈ US$150 for the Mark II (check the Hak5 shop)",
    projects: [
      { title: "What's on the wire?", summary: "Capture your own PC's traffic and compare HTTP and HTTPS in Wireshark.", difficulty: 2 },
    ],
    related: ["lan-turtle", "raspberry-pi", "wifi-pineapple"],
  },
  {
    slug: "hackrf-one",
    name: "HackRF One",
    manufacturer: "Great Scott Gadgets",
    category: "Radio (SDR)",
    tagline: "An open-source software-defined radio from 1 MHz to 6 GHz.",
    description:
      "A wide-band, half-duplex software-defined radio that can receive and transmit. Its hardware and software are open source, which makes it a favourite for learning radio engineering with GNU Radio.",
    website: "https://greatscottgadgets.com/hackrf/one/",
    docs: "https://hackrf.readthedocs.io",
    github: [{ label: "HackRF", url: "https://github.com/greatscottgadgets/hackrf" }],
    community: [{ label: "GNU Radio", url: "https://www.gnuradio.org" }],
    specs: [
      { label: "Frequency range", value: "1 MHz – 6 GHz" },
      { label: "Mode", value: "Half-duplex transceiver" },
      { label: "Sample rate", value: "Up to 20 Msps, 8-bit I/Q" },
      { label: "Interface", value: "USB 2.0 High Speed, SMA antenna port" },
    ],
    protocols: ["Software-defined radio", "I/Q samples"],
    educational: [
      "Learn modulation, sampling and filtering with GNU Radio.",
      "Visualise the spectrum around you: FM, aircraft, weather satellites.",
    ],
    defensive: ["Study how your own wireless devices behave on the spectrum."],
    authorized: ["RF security research in shielded labs or with proper licensing."],
    difficulty: 3,
    price: "≈ US$340 (official resellers)",
    status: "Some resellers now list the HackRF Pro (100 kHz–6 GHz, USB-C) as its successor.",
    projects: [
      { title: "Spectrum explorer", summary: "Receive-only: map FM, ADS-B and weather signals near you.", difficulty: 2 },
      { title: "GNU Radio fundamentals", summary: "Build an FM receiver flowgraph from blocks.", difficulty: 3 },
    ],
    related: ["rtl-sdr-v4", "flipper-zero", "ubertooth-one"],
  },
  {
    slug: "rtl-sdr-v4",
    name: "RTL-SDR Blog V4",
    manufacturer: "RTL-SDR Blog",
    category: "Radio (SDR)",
    tagline: "The cheapest door into software-defined radio.",
    description:
      "A low-cost, receive-only USB SDR based on the RTL2832U chip. It's the classic starter radio: listen to aircraft, weather satellites and broadcast radio while learning the basics of DSP.",
    website: "https://www.rtl-sdr.com/V4/",
    docs: "https://www.rtl-sdr.com/V4/",
    github: [{ label: "osmocom rtl-sdr", url: "https://github.com/osmocom/rtl-sdr" }],
    community: [{ label: "GNU Radio", url: "https://www.gnuradio.org" }],
    specs: [
      { label: "Mode", value: "Receive only" },
      { label: "Chipset", value: "RTL2832U + R828D tuner" },
      { label: "Coverage", value: "500 kHz – 1.766 GHz (HF via built-in upconverter)" },
      { label: "Interface", value: "USB, SMA antenna port" },
    ],
    protocols: ["Software-defined radio (RX)", "ADS-B", "FM", "APT"],
    educational: [
      "Receive weather-satellite images and aircraft positions.",
      "Learn SDR software without transmit risk.",
    ],
    defensive: ["Passive monitoring of your own wireless sensors."],
    authorized: ["Passive RF surveys."],
    difficulty: 1,
    price: "V4L replacement ≈ US$38, or ≈ US$48 with the dipole kit",
    status: "End of line: tuner chips ran out. The RTL-SDR Blog V4L (R828S tuner) replaces it.",
    projects: [
      { title: "ADS-B aircraft tracker", summary: "Track planes overhead and feed a local map.", difficulty: 1 },
      { title: "Weather satellite images", summary: "Receive and decode satellite passes with a homemade antenna.", difficulty: 2 },
    ],
    related: ["hackrf-one", "raspberry-pi"],
  },
  {
    slug: "proxmark3",
    name: "Proxmark3",
    manufacturer: "Proxmark community (RDV4 via proxmark.com)",
    category: "RFID & NFC",
    tagline: "The reference tool for RFID research.",
    description:
      "A powerful RFID research platform covering low-frequency (125/134 kHz) and high-frequency (13.56 MHz) cards. With the community 'Iceman' firmware it is the standard for analysing how access cards work.",
    website: "https://proxmark.com",
    docs: "https://github.com/RfidResearchGroup/proxmark3",
    github: [{ label: "Iceman firmware (RRG)", url: "https://github.com/RfidResearchGroup/proxmark3" }],
    community: [{ label: "Proxmark", url: "https://proxmark.com" }],
    specs: [
      { label: "Frequencies", value: "LF 125/134 kHz and HF 13.56 MHz" },
      { label: "Architecture", value: "FPGA for signal processing + ARM MCU" },
      { label: "Modes", value: "Client over USB, standalone modes" },
    ],
    protocols: ["RFID LF", "NFC / HF (ISO 14443, ISO 15693)"],
    educational: ["Learn how contactless card protocols and their cryptography work."],
    defensive: [
      "Evaluate whether your own access-control cards resist cloning.",
      "Build the case for migrating away from legacy card technology.",
    ],
    authorized: ["Physical access-control assessments within scope."],
    difficulty: 3,
    price: "≈ US$80–350+, depending on version",
    projects: [
      { title: "Card technology inventory", summary: "Identify the technology of each of your own cards.", difficulty: 2 },
      { title: "Access-card security report", summary: "Assess your own lab's cards and recommend upgrades.", difficulty: 3 },
    ],
    related: ["flipper-zero", "yubikey"],
  },
  {
    slug: "yubikey",
    name: "YubiKey",
    manufacturer: "Yubico",
    category: "Authentication",
    tagline: "A hardware key that makes phishing far harder.",
    description:
      "A hardware security key supporting FIDO2/WebAuthn passkeys, smart-card (PIV), OpenPGP and one-time passwords. The most defensive item in any pack: it protects accounts even when a password leaks.",
    website: "https://www.yubico.com",
    docs: "https://developers.yubico.com",
    github: [{ label: "Yubico on GitHub", url: "https://github.com/Yubico" }],
    community: [{ label: "Developer docs", url: "https://developers.yubico.com" }],
    specs: [
      { label: "Protocols", value: "FIDO2/WebAuthn and U2F on all keys; PIV, OpenPGP, OTP and OATH on the YubiKey 5 Series" },
      { label: "Connectors", value: "USB-A, USB-C, NFC or Lightning (varies by model)" },
      { label: "Power", value: "No battery: powered by the host" },
    ],
    protocols: ["FIDO2 / WebAuthn", "U2F", "PIV", "OpenPGP", "OATH-TOTP"],
    educational: ["Learn public-key authentication and why it resists phishing."],
    defensive: [
      "Protect your email, GitHub and cloud accounts with a hardware key.",
      "Sign Git commits and SSH in with a key that never leaves the device.",
    ],
    authorized: ["Test phishing-resistant MFA rollouts in your organisation."],
    difficulty: 1,
    price: "≈ US$29–98, depending on series (FIPS models more)",
    projects: [
      { title: "Lock down your accounts", summary: "Enrol two keys on your main accounts and store one as a backup.", difficulty: 1 },
      { title: "SSH and Git signing", summary: "Use a FIDO2 SSH key and sign your commits.", difficulty: 2 },
    ],
    related: ["usb-rubber-ducky", "proxmark3"],
  },
  {
    slug: "ubertooth-one",
    name: "Ubertooth One",
    manufacturer: "Great Scott Gadgets",
    category: "Wireless",
    tagline: "An open-source 2.4 GHz platform for Bluetooth research.",
    description:
      "An open hardware 2.4 GHz radio for Bluetooth experimentation. It lets researchers and students observe Bluetooth traffic that ordinary adapters hide.",
    website: "https://greatscottgadgets.com/ubertoothone/",
    docs: "https://ubertooth.readthedocs.io",
    github: [{ label: "Ubertooth", url: "https://github.com/greatscottgadgets/ubertooth" }],
    community: [{ label: "Kismet", url: "https://www.kismetwireless.net" }],
    specs: [
      { label: "Band", value: "2.4 GHz" },
      { label: "Hardware", value: "Open-source design, ARM Cortex-M3, RP-SMA antenna" },
    ],
    protocols: ["Bluetooth (BR/LE)", "2.4 GHz"],
    educational: ["Learn how Bluetooth frequency hopping and advertising work."],
    defensive: ["Check what your own Bluetooth devices broadcast."],
    authorized: ["Bluetooth security research on owned or in-scope devices."],
    difficulty: 3,
    price: "No longer manufactured: leftover reseller stock only",
    status: "Retired by Great Scott Gadgets, with no plan to manufacture more.",
    projects: [
      { title: "BLE advertising study", summary: "Observe advertisements from your own wearables and decode them.", difficulty: 2 },
    ],
    related: ["hackrf-one", "esp32-marauder", "wifi-pineapple"],
  },
];

export const bySlug = (slug: string) => equipment.find((e) => e.slug === slug);

export const CATEGORIES = [...new Set(equipment.map((e) => e.category))];
