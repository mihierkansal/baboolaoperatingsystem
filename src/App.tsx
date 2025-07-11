import { createSignal, For, Show, Signal } from "solid-js";
import "./index.css";
import { Window } from "./Components/Window";
import {
  WindowObject,
  WindowID,
  AppObject,
  NativeApp,
  Shortcut,
} from "./types";
import {
  addAppToLocalStorePinned,
  applyWallpaper,
  formatDateAsTime,
  formatDateToLocalISO,
  getPinnedApps,
  getUserProfile,
  launchApp,
  removeAppFromLocalStorePinned,
} from "./utils";
import { Launchpad } from "./Components/Launchpad";
import { Calendar } from "./Components/CalendarWidget";
import { LockScreen } from "./Components/LockScreen";
import { DesktopShortcuts } from "./Components/DesktopShortcuts";

export const shortcuts = createSignal<Shortcut[]>(
  getUserProfile()?.desktopShortcuts || []
);

function App() {
  // Preinstalled
  const PAINT = {
    url: "https://baboolapaint.netlify.app",
    title: "Paint",
    icon: "https://baboolapaint.netlify.app/icon.svg",
    preferredWindowSize: {
      width: 901,
      height: 500,
    },
  };
  const SOUND_REC = {
    url: "https://baboolasoundrecorder.netlify.app",
    title: "Sound Recorder",
    icon: "https://baboolasoundrecorder.netlify.app/icon.svg",
  };
  const CHAT = {
    url: "https://baboolachat.netlify.app",
    title: "AI Chat",
    icon: "https://baboolachat.netlify.app/logo.png",
    preferredWindowSize: {
      width: 500,
      height: 500,
    },
  };

  const SCIENTIFIC_CALCULATOR = {
    url: "https://baboolascientificcalculator.netlify.app",
    title: "Scientific Calculator",
    icon: "https://baboolascientificcalculator.netlify.app/favicon.png",
    preferredWindowSize: {
      width: 500,
      height: 700,
    },
  };

  const CALCULATOR = {
    url: "https://baboolacalculator.netlify.app",
    title: "Basic Calculator",
    icon: "https://baboolacalculator.netlify.app/icon.png",
    preferredWindowSize: {
      width: 500,
      height: 500,
    },
  };
  const TRANSLATOR = {
    url: "https://baboolatranslate.netlify.app",
    title: "Translate",
    icon: "https://baboolatranslate.netlify.app/translator.png",
  };
  const SIMPLY_PRESENT = {
    url: "https://mihierkansal.github.io/simply-present",
    title: "PDF, Image, Video Viewer",
    icon: "https://mihierkansal.github.io/simply-present/icon.png",
    preferredWindowSize: {
      width: 1000,
      height: 550,
    },
  };
  const WEATHER = {
    url: "https://baboolaweather.netlify.app",
    title: "Weather",
    isLink: true,
    icon: "https://baboolaweather.netlify.app/favicon.png",
  };
  const CLOCK = {
    url: "https://baboolaclock.netlify.app",
    title: "Clock",
    icon: "https://baboolaclock.netlify.app/clock.png",
  };
  const UNIT_CONVERTER = {
    url: "https://baboolaunitconverter.netlify.app",
    title: "Unit Converter",
    icon: "https://baboolaunitconverter.netlify.app/favicon.png",
  };
  const SHEETS = {
    url: "https://baboolasheets.netlify.app",
    title: "Sheets",
    icon: "https://baboolasheets.netlify.app/icon.svg",
    preferredWindowSize: {
      width: 901,
      height: 500,
    },
  };
  const NOTES = {
    url: "https://baboolanotes.netlify.app",
    title: "Notes",
    isLink: true,
    icon: "https://baboolanotes.netlify.app/Picture1.png",
  };
  const TEXT_EDITOR = {
    mainViewNativeApp: NativeApp.TextEditor,
    title: "Text Editor",
    icon: "https://baboolatexteditor.netlify.app/icon.hires.png",
  };
  const NEWS = {
    url: "https://baboolanewsandfinance.netlify.app",
    title: "News & Finance",
    icon: "https://baboolanewsandfinance.netlify.app/favicon.hires.png",
  };
  const MUSIC = {
    url: "https://baboolamusicplayer.netlify.app",
    title: "Music Player",
    icon: "https://baboolamusicplayer.netlify.app/play.webp",
  };
  const PASSWORD_GENERATOR = {
    url: "https://baboolapasswordgenerator.netlify.app",
    title: "Password Generator",
    icon: "https://baboolapasswordgenerator.netlify.app/key.svg",
  };
  const DICTIONARY = {
    url: "https://babooladictionary.netlify.app",
    title: "Dictionary",
    icon: "https://babooladictionary.netlify.app/favicon.png",
  };
  const WEB_NAVIGATOR = {
    url: "https://baboolawebnavigator.netlify.app",
    title: "Web Navigator",
    icon: "https://baboolawebnavigator.netlify.app/icon.png",
  };
  const CAMERA = {
    url: "https://baboolacamera.netlify.app",
    title: "Camera",
    icon: "https://baboolacamera.netlify.app/camera.png",
    preferredWindowSize: {
      width: 901,
      height: 600,
    },
  };
  const TEXT_TO_SPEECH = {
    url: "https://baboolatexttospeech.netlify.app",
    title: "Text To Speech",
    icon: "https://baboolatexttospeech.netlify.app/favicon.png",
    preferredWindowSize: {
      width: 901,
      height: 600,
    },
  };
  const SPEECH_TO_TEXT = {
    url: "https://baboolaspeechtotext.netlify.app",
    title: "Speech to Text",
    icon: "https://baboolaspeechtotext.netlify.app/favicon.hires.png",
    preferredWindowSize: {
      width: 901,
      height: 600,
    },
  };
  const SCREEN_RECORDER = {
    url: "https://baboolascreenrecorder.netlify.app",
    title: "Screen Recorder",
    icon: "https://baboolascreenrecorder.netlify.app/favicon.hires.png",
    preferredWindowSize: {
      width: 500,
      height: 500,
    },
  };
  const CALENDAR = {
    url: "https://baboolacalendar.netlify.app",
    title: "Calendar",
    icon: "https://baboolacalendar.netlify.app/favicon.hires.png",
    preferredWindowSize: {
      width: 1001,
      height: 610,
    },
  };
  const GAMES = {
    url: "https://baboolagames.netlify.app",
    title: "Games",
    icon: "https://baboolagames.netlify.app/favicon.hires.png",
    preferredWindowSize: {
      width: 1201,
      height: 640,
    },
  };
  const PHOTO_EDITOR = {
    url: "https://baboolaphotoeditor.netlify.app",
    title: "Photo Editor",
    icon: "https://baboolaphotoeditor.netlify.app/favicon.hires.png",
    preferredWindowSize: {
      width: 1201,
      height: 640,
    },
  };
  const LIVE_CODE_EDITOR = {
    url: "https://baboolalivecodeeditor.netlify.app",
    title: "Live Code Editor",
    icon: "https://baboolalivecodeeditor.netlify.app/favicon.png",
    preferredWindowSize: {
      width: 1201,
      height: 600,
    },
  };

  const SETTINGS: AppObject = {
    mainViewNativeApp: NativeApp.Settings,

    preferredWindowSize: {
      width: 901,
      height: 500,
    },
    title: "System",
    icon: "/gear.svg",
  };
  const FILES: AppObject = {
    mainViewNativeApp: NativeApp.Files,

    preferredWindowSize: {
      width: 901,
      height: 500,
    },
    title: "Files",
    icon: "/folder.png",
  };
  const APP_INSTALLER: AppObject = {
    mainViewNativeApp: NativeApp.Installer,

    preferredWindowSize: {
      width: 901,
      height: 500,
    },
    title: "App Installer",
    icon: "/installer.png",
  };
  const TERMINAL: AppObject = {
    mainViewNativeApp: NativeApp.Terminal,

    preferredWindowSize: {
      width: 901,
      height: 500,
    },
    title: "Terminal",
    icon: "/terminal.png",
  };

  const openWindows = createSignal<WindowObject[]>([]);

  const pinned = createSignal(getPinnedApps());

  const focusedWindowId = createSignal<WindowID>("");

  const launchpadOpen = createSignal(false);

  const calendarOpen = createSignal(false);

  const dateTime = createSignal(new Date());

  const batteryLevel = createSignal(0);

  const isCharging = createSignal(false);

  const isAuthenticated = createSignal(false);

  const tick = () => {
    dateTime[1](new Date());
    //@ts-ignore
    navigator.getBattery?.().then((battery) => {
      batteryLevel[1](battery.level);
      isCharging[1](battery.charging);
    });
  };
  tick();
  setInterval(tick, 500);

  applyWallpaper();

  return (
    <>
      <Show
        when={isAuthenticated[0]()}
        fallback={<LockScreen isAuthenticated={isAuthenticated} />}
      >
        <Show when={!launchpadOpen[0]()}>
          <div class="desktop-widgets">
            <div class="battery-widget">
              <div class={"battery " + (isCharging[0]() ? "charging " : " ")}>
                <div class="battery-end"></div>
                <div class="juice-container">
                  <div
                    class="battery-juice"
                    style={{
                      width: batteryLevel[0]() * 100 + "%",
                    }}
                  ></div>
                </div>
                <div class="battery-end"></div>
              </div>
              <div>{Math.round(batteryLevel[0]() * 100) + "%"} Charged</div>
            </div>
          </div>
          <DesktopShortcuts shortcuts={shortcuts} openWindows={openWindows} />
        </Show>
        <For each={openWindows[0]()}>
          {(win) => {
            return (
              <Window
                app={win}
                onFocus={() => {
                  focusedWindowId[1](win.id);
                }}
                focused={focusedWindowId[0]() === win.id}
                id={win.id}
                hidden={win.hidden[0]() || launchpadOpen[0]()}
                onMinimize={() => {
                  win.hidden[1](true);
                  focusedWindowId[1]("");
                }}
                onClose={() => {
                  openWindows[1]((v) => v.filter((w) => w.id !== win.id));
                  focusedWindowId[1]("");
                }}
              />
            );
          }}
        </For>
        <div
          id="dock"
          style={launchpadOpen[0]() ? "transform:translateY(6rem)" : ""}
        >
          <button
            onClick={() => {
              launchpadOpen[1](true);
            }}
          >
            <span>
              <span
                style={{
                  "letter-spacing": "-10px",
                  display: "flex",
                  "font-size": "1.5rem",
                  "margin-bottom": "-1px",
                }}
              >
                ⠇⠇⠇
              </span>
              Apps
            </span>
          </button>

          <For each={openWindows[0]()}>
            {(win) => {
              return (
                <button
                  class={
                    (focusedWindowId[0]() === win.id ? "active " : " ") +
                    "iconbutton "
                  }
                  onclick={() => {
                    if (focusedWindowId[0]() === win.id) {
                      win.hidden[1](true);
                      focusedWindowId[1]("");
                    } else {
                      win.hidden[1](false);
                      focusedWindowId[1](win.id);
                    }
                  }}
                  title={win.title}
                >
                  <span>
                    <img src={win.icon} alt="" />
                  </span>
                </button>
              );
            }}
          </For>
          <div
            style={{
              "flex-grow": "1",
            }}
          ></div>
          <PinnedApps pinnedAppsList={pinned} openWindowsList={openWindows} />

          <button class="iconbutton" onClick={() => location.reload()}>
            <span>↻</span>
          </button>
          <button
            class={calendarOpen[0]() ? "active" : ""}
            onclick={() => {
              calendarOpen[1]((v) => !v);
            }}
          >
            <span>
              <div>
                <div>{formatDateAsTime(dateTime[0]())}</div>
                <div
                  style={{
                    "margin-top": "-0.25rem",
                    "font-size": "0.9rem",
                  }}
                >
                  {formatDateToLocalISO(dateTime[0]())}
                </div>
              </div>
            </span>
          </button>
        </div>
        <Calendar visibility={calendarOpen} />
        <Launchpad
          visibility={launchpadOpen}
          openWindows={openWindows}
          pinnedApps={pinned}
          preinstalledApps={[
            SCIENTIFIC_CALCULATOR,
            PAINT,
            SOUND_REC,
            CHAT,
            CALCULATOR,
            TRANSLATOR,
            WEATHER,
            TERMINAL,
            CLOCK,
            CALENDAR,
            SHEETS,
            NOTES,
            TEXT_EDITOR,
            DICTIONARY,
            SIMPLY_PRESENT,
            MUSIC,
            UNIT_CONVERTER,
            PASSWORD_GENERATOR,
            WEB_NAVIGATOR,
            TEXT_TO_SPEECH,
            SPEECH_TO_TEXT,
            SCREEN_RECORDER,
            CAMERA,
            SETTINGS,
            APP_INSTALLER,
            FILES,
            GAMES,
            NEWS,
            PHOTO_EDITOR,
            LIVE_CODE_EDITOR,
          ]}
        />
      </Show>
    </>
  );

  function PinnedApps(props: {
    pinnedAppsList: Signal<AppObject[] | undefined>;
    openWindowsList: Signal<WindowObject[]>;
  }) {
    if (!props.pinnedAppsList[0]()) {
      [PAINT, SCIENTIFIC_CALCULATOR, SHEETS, WEATHER].forEach((app) => {
        props.pinnedAppsList[1]((v) => {
          if (!v) v = [];
          v.push(app);
          return v;
        });
        addAppToLocalStorePinned(app);
      });
    }

    return (
      <>
        <div class="divider"></div>
        <For each={props.pinnedAppsList[0]()}>
          {(pinnedApp) => {
            return (
              <button
                title={pinnedApp.title}
                class="iconbutton"
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeAppFromLocalStorePinned(pinnedApp.title);
                  props.pinnedAppsList[1]((v) =>
                    v!.filter((a) => a.title !== pinnedApp.title)
                  );
                }}
                onClick={() => {
                  launchApp(pinnedApp, props.openWindowsList);
                }}
              >
                <span>
                  <img src={pinnedApp.icon} alt="" />
                </span>
              </button>
            );
          }}
        </For>
        <div class="divider"></div>
      </>
    );
  }
}

export default App;
