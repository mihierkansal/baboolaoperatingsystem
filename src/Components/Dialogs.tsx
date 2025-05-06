import { createSignal } from "solid-js";
import { render } from "solid-js/web";

export function showSuccessModal(message: string) {
  const div = document.createElement("div");

  render(
    () => (
      <>
        <div class="modal">
          <h3>Success</h3>
          <div class="checkmark">✔</div>
          <p>{message}</p>
          <button
            onClick={() => {
              div.remove();
            }}
          >
            <span>OK</span>
          </button>
        </div>
      </>
    ),
    div
  );
  document.querySelector("#root")?.append(div);
}

export function promptUser(message: string) {
  return new Promise<string>((resolve, reject) => {
    const div = document.createElement("div");

    render(() => {
      const inpVal = createSignal("");

      return (
        <>
          <div class="modal">
            <p>{message}</p>
            <input
              type="text"
              onInput={(e) => {
                inpVal[1](e.target.value);
              }}
              placeholder="Type here"
            />
            <div class="buttons">
              <button
                onClick={() => {
                  reject();
                  div.remove();
                }}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={() => {
                  resolve(inpVal[0]());
                  div.remove();
                }}
              >
                <span>OK</span>
              </button>
            </div>
          </div>
        </>
      );
    }, div);
    document.querySelector("#root")?.append(div);
  });
}
