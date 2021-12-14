import Store from 'electron-store';

export default new Store({
  defaults: {
    version: '1.0.0',
    resourceTag: 'hunter-refund-canyon',
    uploader: 'SoulHarsh007',
    appearance: [
      {
        name: 'Openbox',
        description:
          'Openbox is a highly configurable window manager. It is known for its minimalistic appearance and its flexibility. It is the most lightweight graphical option offered by RebornOS. Please Note: Openbox is not recommended for users who are new to Linux.',
        image: '/openbox.webp',
        installed: false,
        package: {
          source: '^(openbox)$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-openbox'],
      },
      {
        name: 'i3',
        description:
          'i3 is a tiling window manager, completely written from scratch. i3 is primarily targeted at advanced users and developers. Target platforms are GNU/Linux and BSD operating systems',
        image: '/i3.webp',
        installed: false,
        package: {
          source: '^i3-(gaps|wm|git)(-(next|iconpatch))?(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-i3'],
      },
      {
        name: 'Budgie',
        description:
          'Budgie is the flagship desktop of Solus and is a Solus project. It focuses on simplicity and elegance. Written from scratch with integration in mind, the Budgie desktop tightly integrates with the GNOME stack, but offers an alternative desktop experience.',
        image: '/budgie.webp',
        installed: false,
        package: {
          source: '^(budgie-desktop)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-budgie'],
      },
      {
        name: 'Cinnamon',
        description:
          'Cinnamon is a Linux desktop which provides advanced, innovative features and a traditional desktop user experience. Cinnamon aims to make users feel at home by providing them with an easy-to-use and comfortable desktop experience.',
        image: '/cinnamon.webp',
        installed: false,
        package: {
          source: '^(cinnamon)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-cinnamon'],
      },
      {
        name: 'Deepin',
        description:
          'IMPORTANT: Keep in mind that the Deepin desktop can often be unstable. This does not depend on us, but on the developers of Deepin who usually upload BETA versions of the desktop or some components in the stable repositories of Arch Linux.',
        image: '/deepin.webp',
        installed: false,
        package: {
          source: '^(deepin-desktop-base)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-deepin'],
      },
      {
        name: 'Enlightenment',
        description:
          'Enlightenment is not just a window manager for Linux/X11 and others, but also a whole suite of libraries to help you create beautiful user interfaces with much less work\\n',
        image: '/enlightenment.webp',
        installed: false,
        package: {
          source: '^(enlightenment)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-enlightenment'],
      },
      {
        name: 'GNOME',
        description:
          'GNOME is an easy and elegant way to use your computer. It features the Activities Overview which is an easy way to access all your basic tasks.',
        image: '/gnome.webp',
        installed: false,
        package: {
          source: '^(gnome-shell)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-gnome'],
      },
      {
        name: 'KDE Plasma',
        description:
          "If you are looking for a familiar working environment, KDE's Plasma Desktop offers all the tools required for a modern desktop computing experience so you can be productive right from the start.",
        image: '/kde.webp',
        installed: false,
        package: {
          source: '^(plasma-desktop)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-kde'],
      },
      {
        name: 'LXQt',
        description:
          'LXQt is the next-generation of LXDE, the Lightweight Desktop Environment. It is lightweight, modular, blazing-fast, and user-friendly.',
        image: '/lxqt.webp',
        installed: false,
        package: {
          source: '^(lxqt-config)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-lxqt'],
      },
      {
        name: 'MATE',
        description:
          'MATE is an intuitive, attractive, and lightweight desktop environment which provides a more traditional desktop experience. Accelerated compositing is supported, but not required to run MATE making it suitable for lower-end hardware.',
        image: '/mate.webp',
        installed: false,
        package: {
          source: '^(mate-panel)(-git)?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-mate'],
      },
      {
        name: 'XFCE',
        description:
          'Xfce is a lightweight desktop environment. It aims to be fast and low on system resources, while remaining visually appealing and user friendly. It suitable for use on older computers and those with lower-end hardware specifications.',
        image: '/xfce.webp',
        installed: false,
        package: {
          source: '^(xfce4-session)(-(git|devel|gtk2))?$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-xfce'],
      },
      {
        name: 'UKUI',
        description:
          'UKUI is simple and intuitive interface adapted to the habit of users. Files category speed up file search. Favorite apps shortcut makes starting up application more convenient. User management makes a more concise and friendly interaction for system.',
        image: '/ukui.webp',
        installed: false,
        package: {
          source: '^(ukui-session-manager)$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-ukui'],
      },
      {
        name: 'LXDE',
        description:
          'LXDE, which stands for Lightweight X11 Desktop Environment, is a desktop environment which is lightweight and fast. It is designed to be user friendly and slim, while keeping the resource usage low. LXDE uses less RAM and less CPU while being a feature rich desktop environment.',
        image: '/lxde.webp',
        installed: false,
        package: {
          source: '^(lxde-common)$',
          flags: 'gm',
        },
        deps: ['rebornos-cosmic-lxde'],
      },
    ],
    dms: [
      {
        name: 'LightDM',
        description: 'A lightweight display manager',
        image: '/lightdm.webp',
        installed: false,
        package: {
          source: '^(lightdm)(-(devel|git))?$',
          flags: 'gm',
        },
        deps: ['lightdm', 'lightdm-gtk-greeter'],
        enabled: false,
      },
      {
        name: 'SDDM',
        description: 'QML based X11 and Wayland display manager',
        image: '/sddm.webp',
        installed: false,
        package: {
          source: '^(sddm)(-wayland)?(-git)?$',
          flags: 'gm',
        },
        deps: ['sddm'],
        enabled: false,
      },
      {
        name: 'GDM',
        description: 'GNOME Display manager and login screen',
        image: '/gdm.webp',
        installed: false,
        package: {
          source: '^(gdm)(-git)?$',
          flags: 'gm',
        },
        deps: ['gdm'],
        enabled: false,
      },
      {
        name: 'LXDM',
        description: 'Lightweight X11 Display Manager',
        image: '/lxdm.webp',
        installed: false,
        package: {
          source: '^(lxdm)(-(git|gtk3))?$',
          flags: 'gm',
        },
        deps: ['lxdm-gtk3'],
        enabled: false,
      },
    ],
    kernels: [
      {
        name: 'Linux',
        description: 'The default Arch Linux kernel and modules',
        installed: false,
        package: {
          source: '^linux$',
          flags: 'gm',
        },
        deps: ['linux', 'linux-headers'],
        match: {
          source: '([0-9]{1,2}.){2}([0-9]{1,3}.)?(arch)?[0-9]-[0-9]',
          flags: 'g',
        },
      },
      {
        name: 'Linux LTS',
        description: 'The LTS Linux kernel and modules',
        installed: false,
        package: {
          source: '^linux-lts$',
          flags: 'gm',
        },
        deps: ['linux-lts', 'linux-lts-headers'],
        match: {
          source: '([0-9]{1,2}.){2}([0-9]{1,3})?-[0-9]',
          flags: 'g',
        },
      },
      {
        name: 'Linux Zen',
        description: 'The Linux ZEN kernel and modules',
        installed: false,
        package: {
          source: '^linux-zen$',
          flags: 'gm',
        },
        deps: ['linux-zen', 'linux-zen-headers'],
        match: {
          source: '([0-9]{1,2}.){2}([0-9]{1,3}.)?(zen)?[0-9]-[0-9]',
          flags: 'g',
        },
      },
      {
        name: 'Linux Hardened',
        description: 'The Security-Hardened Linux kernel and modules',
        installed: false,
        package: {
          source: '^linux-hardened$',
          flags: 'gm',
        },
        deps: ['linux-hardened', 'linux-hardened-headers'],
        match: {
          source: '([0-9]{1,2}.){2}([0-9]{1,3}.)?(hardened[0-9]|a|b)-[0-9]',
          flags: 'g',
        },
      },
    ],
    utils: {
      categories: [
        'Office',
        'Gaming',
        'Browsers',
        'Music',
        'Video',
        'Developer',
      ],
      packages: [
        {
          name: 'WPS Office',
          img: '/wps-office.webp',
          tags: [],
          installed: false,
          package: {
            source: '^wps-office(-cn)?$',
            flags: 'gm',
          },
          category: 'Office',
          deps: ['wps-office'],
          description:
            'Kingsoft Office (WPS Office) - an office productivity suite',
        },
        {
          name: 'Libre Office (Fresh)',
          img: '/libreoffice.webp',
          tags: [],
          installed: false,
          package: {
            source: '^libreoffice-(fresh|still|dev-bin)$',
            flags: 'gm',
          },
          category: 'Office',
          deps: ['libreoffice-fresh'],
          description:
            'LibreOffice branch which contains new features and program enhancements',
        },
        {
          name: 'Free Office',
          img: '/freeoffice.webp',
          tags: [],
          installed: false,
          package: {
            source: '^freeoffice$',
            flags: 'gm',
          },
          category: 'Office',
          deps: ['freeoffice'],
          description:
            'A complete, reliable, lightning-fast and Microsoft Office-compatible office suite with a word processor, spreadsheet, and presentation graphics software',
        },
        {
          name: 'Calligra',
          img: '/calligra.webp',
          tags: [],
          installed: false,
          package: {
            source: '^calligra(-git)?$',
            flags: 'gm',
          },
          category: 'Office',
          deps: ['calligra'],
          description:
            'A set of applications for productivity and creative usage',
        },
        {
          name: 'Steam',
          img: '/steam.webp',
          tags: [],
          installed: false,
          package: {
            source: '^steam$',
            flags: 'gm',
          },
          category: 'Gaming',
          deps: ['steam'],
          description: "Valve's digital software delivery system",
        },
        {
          name: 'Discord',
          img: '/discord.webp',
          tags: [],
          installed: false,
          package: {
            source: '^discord(-canary)?$',
            flags: 'gm',
          },
          category: 'Gaming',
          deps: ['discord'],
          description:
            "All-in-one voice and text chat for gamers that's free and secure",
        },
        {
          name: 'Wine',
          img: '/wine.webp',
          tags: [],
          installed: false,
          package: {
            source: '^wine(-(git|staging))?$',
            flags: 'gm',
          },
          category: 'Gaming',
          deps: ['wine'],
          description: 'A compatibility layer for running Windows programs',
        },
        {
          name: 'Firefox',
          img: '/firefox.webp',
          tags: [],
          installed: false,
          package: {
            source: '^firefox(-bin)?$',
            flags: 'gm',
          },
          category: 'Browsers',
          deps: ['firefox'],
          description: 'Standalone web browser from mozilla.org',
        },
        {
          name: 'Brave',
          img: '/brave.webp',
          tags: [],
          installed: false,
          package: {
            source: '^brave(-(bin|beta-bin|dev-bin|git|nightly-bin))?$',
            flags: 'gm',
          },
          category: 'Browsers',
          deps: ['brave-bin'],
          description: 'Web browser that blocks ads and trackers by default',
        },
        {
          name: 'Chromium',
          img: '/chromium.webp',
          tags: [],
          installed: false,
          package: {
            source: '^chromium(-(snapshot-bin|dev))?$',
            flags: 'gm',
          },
          category: 'Browsers',
          deps: ['chromium'],
          description:
            'A web browser built for speed, simplicity, and security',
        },
        {
          name: 'Google Chrome',
          img: '/google-chrome.webp',
          tags: [],
          installed: false,
          package: {
            source: '^google-chrome(-(beta|dev))?$',
            flags: 'gm',
          },
          category: 'Browsers',
          deps: ['google-chrome'],
          description:
            'The popular and trusted web browser by Google (Stable Channel)',
        },
        {
          name: 'Spotify',
          img: '/spotify.webp',
          tags: [],
          installed: false,
          package: {
            source: '^spotify(-(snap|dev))?$',
            flags: 'gm',
          },
          category: 'Music',
          deps: ['spotify'],
          description: 'A proprietary music streaming service',
        },
        {
          name: 'Gnome Music',
          img: '/gnome-music.webp',
          tags: [],
          installed: false,
          package: {
            source: '^gnome-music(-git)?$',
            flags: 'gm',
          },
          category: 'Music',
          deps: ['gnome-music'],
          description: 'Music player and management application',
        },
        {
          name: 'VLC',
          img: '/vlc.webp',
          tags: [],
          installed: false,
          package: {
            source: '^vlc(-git)?$',
            flags: 'gm',
          },
          category: 'Video',
          deps: ['vlc'],
          description: 'Multi-platform MPEG, VCD/DVD, and DivX player',
        },
        {
          name: 'Code - OSS',
          img: '/code.webp',
          tags: [],
          installed: false,
          package: {
            source: '^code(-git)?$',
            flags: 'gm',
          },
          category: 'Developer',
          deps: ['code'],
          description:
            'The Open Source build of Visual Studio Code (vscode) editor',
        },
        {
          name: 'Android Studio',
          img: '/android-studio.webp',
          tags: [],
          installed: false,
          package: {
            source: '^android-studio(-(canary|beta|dummy))?$',
            flags: 'gm',
          },
          category: 'Developer',
          deps: ['android-studio'],
          description: 'The official Android IDE (Stable branch)',
        },
      ],
    },
  },
  name: 'modules',
  clearInvalidConfig: true,
  encryptionKey: process.env.MODULES_KEY,
});
