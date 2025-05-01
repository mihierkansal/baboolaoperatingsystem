import { Signal, Show, For } from "solid-js";
import { AppObject, WindowObject } from "../types";
import {
  launchApp,
  addAppToLocalStorePinned,
  getUserProfile,
  removeAppFromLocalStorePinned,
  updateUserProfile,
} from "../utils";

export function Launchpad(props: {
  preinstalledApps: AppObject[];
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
          <For
            each={[
              ...props.preinstalledApps,
              ...(getUserProfile()?.customApps || []),
            ]}
          >
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
                  <div class="appbtns">
                    <button
                      title="Pin to dock"
                      class="action"
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
                    <Show when={app.isCustom}>
                      <button
                        title="Delete"
                        class="action"
                        onClick={(e) => {
                          e.stopPropagation();

                          removeAppFromLocalStorePinned(app.title);
                          props.pinnedApps[1]((v) => {
                            return [...(v || [])].filter(
                              (a) => a.title !== app.title
                            );
                          });

                          const profile = getUserProfile();

                          updateUserProfile({
                            ...profile,
                            customApps: profile?.customApps?.filter(
                              (a) => a.title !== app.title
                            ),
                          });

                          props.visibility[1](false);
                        }}
                      >
                        <span>✕</span>
                      </button>
                    </Show>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}
