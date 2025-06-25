import { createSignal, For, Signal } from "solid-js";
import { NativeApp, Shortcut, WindowObject } from "../types";
import { generateRandomString, updateShortcutsInLS } from "../utils";

export function DesktopShortcuts(props: {
  openWindows: Signal<WindowObject[]>;
  shortcuts: Signal<Shortcut[]>;
}) {
  return (
    <div class="desktop-shortcuts">
      <For each={props.shortcuts[0]()}>
        {(shortcut) => {
          return (
            <div
              onContextMenu={(e) => {
                e.preventDefault();
                props.shortcuts[1]((v) => {
                  return [...v.filter((s) => s.name !== shortcut.name)];
                });
                updateShortcutsInLS(props.shortcuts[0]());
              }}
              onDblClick={() => {
                if (shortcut.folderPath) {
                  props.openWindows[1]((v) => {
                    v.push({
                      mainViewNativeApp: NativeApp.Files,
                      title: "Files",
                      hidden: createSignal(false),
                      icon: "/folder.png",
                      id: generateRandomString(9),
                      nativeAppProps: {
                        folderPath: shortcut.folderPath,
                        filename: shortcut.filename,
                      },
                    });
                    return [...v];
                  });
                }
                if (shortcut.app) {
                  if (shortcut.app.isLink) {
                    window.open(shortcut.app.url, "_blank");
                    return;
                  } else {
                    props.openWindows[1]((v) => {
                      v.push({
                        ...shortcut.app!,
                        hidden: createSignal(false),
                        id: generateRandomString(9),
                      });
                      return [...v];
                    });
                  }
                }
              }}
              class="desktop-shortcut"
            >
              <img
                height={60}
                src={
                  shortcut.app
                    ? shortcut.app.icon
                    : shortcut.filename
                    ? "/file.png"
                    : "/folder.png"
                }
              />
              <p>{shortcut.name}</p>
            </div>
          );
        }}
      </For>
    </div>
  );
}
