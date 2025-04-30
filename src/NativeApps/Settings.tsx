import { createSignal, For, Match, Show, Switch } from "solid-js";
import {
  applyWallpaper,
  getUserProfile,
  hashString,
  profilePics,
  updateUserProfile,
  wallpapers,
} from "../utils";
import Bowser from "bowser";

export function Settings() {
  enum SettingsTab {
    Account,
    Personalization,
    Device,
    About,
    Reset,
  }

  const settingsTabs: {
    text: string;
    value: SettingsTab;
  }[] = [
    {
      text: "Account",
      value: SettingsTab.Account,
    },
    {
      text: "Personalization",
      value: SettingsTab.Personalization,
    },
    {
      text: "Device",
      value: SettingsTab.Device,
    },
    {
      text: "About",
      value: SettingsTab.About,
    },
    {
      text: "Reset Baboola OS",
      value: SettingsTab.Reset,
    },
  ];

  const selectedTab = createSignal(SettingsTab.Personalization);

  const existingUserProfile = getUserProfile();

  return (
    <>
      <div class="settings-container">
        <nav class="settings-menu">
          <For each={settingsTabs}>
            {(tab) => {
              return (
                <div
                  class={selectedTab[0]() === tab.value ? "active" : ""}
                  onClick={() => {
                    selectedTab[1](tab.value);
                  }}
                >
                  {tab.text}
                </div>
              );
            }}
          </For>
        </nav>
        <div class="settings-main">
          <Switch>
            <Match when={selectedTab[0]() === SettingsTab.Account}>
              <AccountSettings />
            </Match>
            <Match when={selectedTab[0]() === SettingsTab.About}>
              <About />
            </Match>
            <Match when={selectedTab[0]() === SettingsTab.Personalization}>
              <Personalization />
            </Match>
            <Match when={selectedTab[0]() === SettingsTab.Device}>
              <Device />
            </Match>
            <Match when={selectedTab[0]() === SettingsTab.Reset}>
              <Reset />
            </Match>
          </Switch>
        </div>
      </div>
    </>
  );

  function AccountSettings() {
    let passwordInp!: HTMLInputElement;

    const name = createSignal(existingUserProfile?.name);

    const profilePicture = createSignal(
      existingUserProfile?.profilePic || profilePics[0]
    );

    const passwordHash = createSignal(existingUserProfile?.passwordHash);

    return (
      <>
        <h3>Account</h3>
        <p>
          Set up a name, profile picture, and password for your account here.
        </p>
        <label>
          Name
          <input
            value={name[0]() || ""}
            onInput={(e) => {
              name[1](e.target.value);
            }}
            placeholder="type here"
            type="text"
          />
        </label>
        <label>
          Profile Picture
          <div class="profile-picture-select">
            <For each={profilePics}>
              {(pic) => {
                return (
                  <div
                    onClick={() => {
                      profilePicture[1](pic);
                    }}
                    class={profilePicture[0]() === pic ? "selected" : ""}
                    style={{
                      background: `url('${pic}')`,
                      "background-size": "4rem 4rem",
                    }}
                  />
                );
              }}
            </For>
          </div>
        </label>
        <label>
          Password (Optional)
          <input
            onInput={(e) => {
              passwordHash[1](
                e.target.value.length ? hashString(e.target.value) : undefined
              );
            }}
            ref={passwordInp}
            placeholder="type here"
            type="password"
          />
        </label>
        <div class="buttons">
          <button
            onClick={() => {
              if (!name[0]()) return;
              const updatedProfile = {
                ...(existingUserProfile || {}),
                name: name[0]()!,
                profilePic: profilePicture[0](),
              };

              if (passwordHash[0]()) {
                updatedProfile.passwordHash = passwordHash[0]();
              }

              updateUserProfile(updatedProfile);
            }}
          >
            <span>Save</span>
          </button>
          <button
            onClick={() => {
              if (!name[0]()) return;
              const updatedProfile = {
                ...(existingUserProfile || {}),
                name: undefined,
                passwordHash: undefined,
                profilePic: "/soccer.png",
              };

              name[1](undefined);
              profilePicture[1]("/soccer.png");
              passwordInp.value = "";

              updateUserProfile(updatedProfile);
            }}
          >
            <span>Reset</span>
          </button>
        </div>
      </>
    );
  }

  function About() {
    return (
      <>
        <h3>About</h3>

        <img src="/logo.png" height={50} />

        <h4>Baboola OS</h4>
        <h5>Version 1.0.0</h5>
        <p>
          {" "}
          <a target="_blank" href="https://github.com/mihierkansal">
            Creator's Github
          </a>
        </p>
        <p>Copyright 2025 Mihier Kansal &lt;mihierkansal@outlook.com&gt;</p>

        <p>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          “Software”), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </p>

        <p>
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>

        <p>
          THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </>
    );
  }

  function Personalization() {
    const userProfile = getUserProfile();

    const wallpaper = createSignal(userProfile?.wallpaper || wallpapers[0]);

    return (
      <>
        <h3>Personalization</h3>

        <label>
          Wallpaper
          <div class="wallpaper-select">
            <For each={wallpapers}>
              {(pic) => {
                return (
                  <div
                    onClick={() => {
                      wallpaper[1](pic);
                    }}
                    class={wallpaper[0]() === pic ? "selected" : ""}
                    style={{
                      background: `url('${pic}')`,
                      "background-size": "100% 100%",
                    }}
                  />
                );
              }}
            </For>
          </div>
        </label>
        <div class="buttons">
          <button
            onClick={() => {
              updateUserProfile({
                ...(userProfile || {}),
                wallpaper: wallpaper[0](),
              });
              applyWallpaper();
            }}
          >
            <span>Save</span>
          </button>
        </div>
      </>
    );
  }

  function Device() {
    const userAgent = Bowser.parse(navigator.userAgent);

    const batteryLevel = createSignal<number>();

    const isCharging = createSignal(false);

    const connection = createSignal<any>();

    const ip = createSignal<string>();

    const country = createSignal<string>();

    const tick = () => {
      //@ts-ignore
      navigator.getBattery?.().then((battery) => {
        batteryLevel[1](battery.level);
        isCharging[1](battery.charging);
      });

      //@ts-ignore
      connection[1](navigator.connection);
    };
    tick();
    setInterval(tick, 500);

    const getIp = () => {
      fetch("https://ipinfo.io/json?token=26b6239a3a8da1") // Replace with your actual API token
        .then((response) => response.json())
        .then((data) => {
          console.log("IP Address:", data.ip);
          ip[1](data.ip);
          console.log("Country:", data.country);
          country[1](data.country);
        });
    };

    getIp();

    return (
      <>
        <h3>Device</h3>

        <label>
          Display Size: {screen.width}x{screen.height}
        </label>
        <label>
          Browser: {userAgent.browser.name} {userAgent.browser.version}
        </label>
        <label>Logical CPU Cores: {navigator.hardwareConcurrency}</label>

        <Show when={connection[0]() !== undefined}>
          <label>Downlink speed: {connection[0]().downlink} Mbps</label>
        </Show>
        <Show when={batteryLevel[0]() !== undefined}>
          <label>
            Battery: {batteryLevel[0]()! * 100}%,{" "}
            {isCharging[0]() ? "Charging" : "Not Charging"}
          </label>
        </Show>
        <Show when={ip[0]() !== undefined}>
          <label>IP Address: {ip[0]()}</label>
          <label>Country: {country[0]()}</label>
        </Show>
      </>
    );
  }

  function Reset() {
    return (
      <>
        <h3>Reset Baboola OS</h3>
        <p>
          This will reset all settings, locally stored data, and pinned apps.
        </p>
        <button
          onclick={() => {
            localStorage.clear();
            location.reload();
          }}
        >
          Reset
        </button>
      </>
    );
  }
}
