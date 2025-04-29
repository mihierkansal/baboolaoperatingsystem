import {
  createEffect,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
  Show,
  Signal,
} from "solid-js";
import { downloadTextFile } from "../utils";

export function Terminal() {
  const hist = createSignal([<></>]);
  let inp!: HTMLInputElement;
  const promptMsg = "user@baboola-pc ~# ";

  const executingCmd = createSignal(false);

  onMount(() => {
    inp.focus();
  });

  return (
    <>
      <div class="terminal">
        <For each={hist[0]()}>
          {(item) => {
            return <div>{item}</div>;
          }}
        </For>
        <Show when={!executingCmd[0]()}>
          <div>
            {promptMsg}
            <input
              spellcheck={false}
              ref={inp}
              autocorrect="off"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const target = e.target as any as {
                    value: string;
                  };
                  hist[1]((v) => {
                    v.push(promptMsg + target.value);
                    return [...v];
                  });
                  executingCmd[1](true);
                  const output = await runCommand(target.value);
                  executingCmd[1](false);
                  onMount(() => {
                    hist[1]((v) => {
                      inp.focus();
                      v.push(output!);
                      return [...v];
                    });
                  });
                }
              }}
            />
          </div>
        </Show>
      </div>
    </>
  );

  function runCommand(command: string) {
    // dpkg installs an app

    return new Promise<JSX.Element>((resolve) => {
      const isHelp = command.includes("--help");
      if (command === "help") {
        resolve(
          <>
            Commands: <br />
            nano (text editor)
            <br />
            restart (restarts baboola OS) <br />
            npm create (pretends to create a node js project) <br />
          </>
        );
      }
      if (command === "nano") {
        const vis = createSignal(true);

        hist[1]((v) => {
          v.push(
            <>
              <Show when={vis[0]()}>
                <Nano visibility={vis} />
              </Show>
            </>
          );

          return [...v];
        });

        createEffect(() => {
          if (vis[0]() === false) {
            resolve(<></>);
          }
        });
      } else if (command === "restart") {
        location.reload();
      } else if (command.includes("dpkg")) {
        if (command.includes(" -i ")) {
          const siteURL = command.split(" -i ")[1].trim();
          console.log(siteURL);
          //   const newApp
        } else {
          if (!isHelp) {
            unknownCommandOrArguments();
          }

          resolve(
            <>
              Purpose: Installs a website as an app. Note that this may not work
              with certain websites due to CORS restrictions.
              <br />
              Usage: dpkg -i &lt;website url&gt;
            </>
          );
        }
      } else if (command.includes("npm create")) {
        hist[1]((v) => {
          v.push(<>Creating...</>);
          return [...v];
        });

        setTimeout(() => {
          resolve(
            <>
              Done. Now run:
              <br />
              cd &lt;project name&gt;
              <br />
              npm i
              <br />
              npm run dev
              <br />
            </>
          );
        }, 5000);
      } else {
        resolve(<>Done</>);
      }

      function unknownCommandOrArguments() {
        hist[1]((v) => {
          v.push(<>Command not found or arguments invalid.</>);
          return [...v];
        });
      }
    });
  }
}

function Nano(props: { visibility: Signal<boolean> }) {
  const fileName = createSignal<string>();

  const kd = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "q") {
      props.visibility[1](false);
    } else if (e.ctrlKey && e.key === "d") {
      e.preventDefault();
      //@ts-ignore
      const txt = document.getElementById("nanoeditor")!.value;
      downloadTextFile("file.txt", txt);
    } else if (e.ctrlKey && e.key === "o") {
      e.preventDefault();
      const fi = document.createElement("input");
      fi.type = "file";
      fi.hidden = true;
      document.body.appendChild(fi);
      fi.click();
      fi.onchange = (e) => {
        const file = (e.target as HTMLInputElement)!.files?.[0];
        if (file) {
          fileName[1](file.name);
          const fr = new FileReader();
          fr.onload = (e) => {
            const text = e.target!.result;
            (document.getElementById(
              "nanoeditor"
            ) as HTMLTextAreaElement)!.value = text as string;
          };
          fr.readAsText(file);
        }
      };
    } else {
      console.log(e.key, e.ctrlKey);
    }
  };

  onCleanup(() => {
    window.removeEventListener("keydown", kd);
  });

  onMount(() => {
    window.addEventListener("keydown", kd);
    setTimeout(() => {
      document.getElementById("nanoeditor")?.focus();
    });
  });
  return (
    <>
      {" "}
      <div class="fullwin-termapp">
        <div
          class="greybg"
          style={{
            "text-align": "center",
          }}
        >
          GNU nano 7.2 - {fileName[0]() || "New Buffer"}
        </div>
        <textarea id="nanoeditor"></textarea>
        <div class="kbdlist">
          <div>
            <span class="greybg">^Q</span> Exit
          </div>
          <div>
            <span class="greybg">^O</span> Open File
          </div>
          <div>
            <span class="greybg">^D</span> Download
          </div>
        </div>
      </div>
    </>
  );
}
