import { createSignal, onMount, createEffect, onCleanup, Show } from "solid-js";
import { render } from "solid-js/web";
import { AppObject, WindowID } from "../types";
import { generateRandomNumberFrom, isN1ApproxN2 } from "../utils";
import { NativeAppView } from "../NativeApps";

export const SNAP_MARGIN = 2;
const SNAP_MAXIMIZE_MARGIN = 60;
export function Window(props: {
  onClose: () => void;
  hidden: boolean;
  onMinimize: () => void;
  app: AppObject;
  focused: boolean;
  onFocus: () => void;
  id: WindowID;
}) {
  const winContainerContainer = document.createElement("div");

  winContainerContainer.id = props.id;

  if (!document.getElementById(props.id)) {
    render(() => {
      const isDragging = createSignal(false);
      const isResizing = createSignal(false);

      const snapType = createSignal<
        "snapleft" | "snapright" | "maximized" | ""
      >("");

      let offsetX: number, offsetY: number;

      let container!: HTMLDivElement;

      let frame!: HTMLIFrameElement;

      let dragHandle!: HTMLDivElement;

      onMount(() => {
        dragHandle.addEventListener("mousedown", mouseDown);

        document.addEventListener("mousemove", mouseMove);

        document.addEventListener("mouseup", mouseUp);

        if (props.app.preferredWindowSize) {
          container.style.width = props.app.preferredWindowSize.width + "px";
          container.style.height = props.app.preferredWindowSize.height + "px";
        }

        container.style.left = generateRandomNumberFrom(20, 60) + "px";
        container.style.top = generateRandomNumberFrom(20, 60) + "px";

        createEffect(() => {
          if (!props.hidden) focusWin();
        });
      });

      onCleanup(() => {
        document.removeEventListener("mousedown", mouseDown);
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        winContainerContainer?.remove();
      });

      return (
        <>
          {" "}
          <div
            class={
              "window " +
              (props.hidden ? "hidden " : " ") +
              (props.focused ? "focused " : " ") +
              (snapType[0]() + " ")
            }
            onpointerdown={() => {
              focusWin();
            }}
            ref={container}
          >
            <div class="header">
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => {
                    winContainerContainer.remove();
                    props.onClose();
                  }}
                >
                  <span>✕</span>
                </button>
                <button
                  onClick={() => {
                    snapType[1]((v) => {
                      if (v === "maximized") {
                        v = "";
                      } else {
                        v = "maximized";
                      }
                      return v;
                    });
                  }}
                >
                  <span>▢</span>
                </button>
                <button onclick={props.onMinimize}>
                  <span>-</span>
                </button>
              </div>
              <div
                class="drag-handle"
                ref={dragHandle}
                style={{
                  cursor: isDragging[0]() ? "grabbing" : "grab",
                }}
              >
                {props.app.title}
              </div>
              <button
                onClick={() => {
                  frame.requestFullscreen();
                }}
              >
                ⛶&#xFE0E;
              </button>
            </div>
            <div class="main">
              <div class="overlay"></div>
              <Show
                when={props.app.url}
                fallback={
                  <div ref={frame} class="app-content">
                    <NativeAppView app={props.app} />
                  </div>
                }
              >
                <iframe
                  allow="camera; microphone; display-capture; autoplay; clipboard-write;"
                  style={{
                    "z-index":
                      isDragging[0]() || isResizing[0]() || !props.focused
                        ? "-1"
                        : "2",
                  }}
                  ref={frame}
                  src={props.app.url}
                ></iframe>
              </Show>
            </div>
            <div
              ref={(el) => {
                el.addEventListener("mousedown", resizeMarkerMouseDown);
                window.addEventListener("mouseup", resizeMarkerMouseUp);
                window.addEventListener("mousemove", resizeMarkerMouseMove);

                onCleanup(() => {
                  el.removeEventListener("mousedown", resizeMarkerMouseDown);
                  window.removeEventListener(
                    "mousemove",
                    resizeMarkerMouseMove
                  );
                  window.removeEventListener("mouseup", resizeMarkerMouseUp);
                });
              }}
              class="resize-marker"
            >
              ⇲
            </div>
          </div>
        </>
      );

      function resizeMarkerMouseMove(e: MouseEvent) {
        if (!isResizing[0]()) return;
        if (snapType[0]()) return;
        container.style.width = container.clientWidth + e.movementX + "px";
        container.style.height = container.clientHeight + e.movementY + "px";
      }

      function resizeMarkerMouseUp() {
        isResizing[1](false);
      }

      function resizeMarkerMouseDown() {
        isResizing[1](true);
      }

      function mouseDown(e: MouseEvent) {
        isDragging[1](true);
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
      }

      function mouseMove(e: MouseEvent) {
        if (isDragging[0]()) {
          const oldX = container.style.left,
            oldY = container.style.top;
          const newX = e.clientX - offsetX,
            newY = Math.max(e.clientY - offsetY, 0);
          container.style.left = newX + "px";
          container.style.top = newY + "px";
          if (newY < SNAP_MARGIN) {
            if (e.clientX < SNAP_MARGIN) {
              snapType[1]("snapleft");
            } else if (window.innerWidth - e.clientX < SNAP_MARGIN) {
              snapType[1]("snapright");
            } else if (
              isN1ApproxN2(
                e.clientX,
                window.innerWidth / 2,
                SNAP_MAXIMIZE_MARGIN
              )
            ) {
              snapType[1]("maximized");
            } else {
              return;
            }
            container.style.top = oldY;
            container.style.left = oldX;
          } else {
            snapType[1]("");
          }
        }
      }

      function mouseUp() {
        isDragging[1](false);
      }

      function focusWin() {
        props.onFocus();
      }
    }, winContainerContainer);
    document.getElementById("root")?.appendChild(winContainerContainer);
  }

  return <></>;
}
