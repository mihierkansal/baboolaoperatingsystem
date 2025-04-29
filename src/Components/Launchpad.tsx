import { Signal, Show, For } from "solid-js";
import { AppObject, WindowObject } from "../types";
import { launchApp, addAppToLocalStorePinned } from "../utils";

export function Launchpad(props: {
  apps: AppObject[];
  visibility: Signal<boolean>;
  openWindows: Signal<WindowObject[]>;
  pinnedApps: Signal<AppObject[] | undefined>;
}) {
  return (
    <Show when={props.visibility[0]()}>
      <div class="launchpad">
        <div class="header">
          <button
            onClick={() => {
              props.visibility[1](false);
            }}
          >
            ✕
          </button>
        </div>
        <div class="appgrid">
          <For each={props.apps}>
            {(app) => {
              return (
                <div
                  onClick={() => {
                    launchApp(app, props.openWindows);
                    props.visibility[1](false);
                  }}
                >
                  <img src={app.icon} />
                  <div>{app.title}</div>
                  <button
                    title="Pin to dock"
                    class="pinbtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addAppToLocalStorePinned(app);
                      props.pinnedApps[1]((v) => {
                        if (!v) v = [];
                        v.push(app);
                        return [...v];
                      });
                      props.visibility[1](false);
                    }}
                  >
                    <span>📌&#xFE0E;</span>
                  </button>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}
