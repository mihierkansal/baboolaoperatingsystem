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
