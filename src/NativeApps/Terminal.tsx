import { createSignal, For, JSX, onMount, Show } from "solid-js";

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
      if (command === "nano") {
        resolve(
          <>
            <div
              class="fullwin-termapp"
              onClick={(e) => {
                e.currentTarget.remove();
                inp.focus();
              }}
            >
              <input
                type="text"
                value={"ey"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          </>
        );
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
    });
  }
}
