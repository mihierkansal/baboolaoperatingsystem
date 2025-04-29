import { createSignal, Show, Signal } from "solid-js";
import { getUserProfile, hashString } from "../utils";

export function LockScreen(props: { isAuthenticated: Signal<boolean> }) {
  const userProfile = getUserProfile();

  if (!userProfile?.name) {
    props.isAuthenticated[1](true);
  }

  const passwordHash = createSignal<string>();

  return (
    <>
      <div class="lock-screen-main">
        <img
          src={userProfile?.profilePic || "/soccer.png"}
          height={150}
          width={150}
          class="profile-image"
        />
        <h2>{userProfile?.name}</h2>
        <Show when={userProfile?.passwordHash}>
          <input
            type="password"
            onInput={(e) => {
              passwordHash[1](hashString(e.target.value));
            }}
            onChange={() => {
              checkPasswordAndAuthenticate();
            }}
            placeholder="password"
          />
        </Show>
        <div
          style={{
            display: "grid",
            "place-items": "center",
          }}
        >
          <button
            onClick={() => {
              checkPasswordAndAuthenticate();
            }}
          >
            <span>Log In</span>
          </button>
        </div>
      </div>
    </>
  );

  function checkPasswordAndAuthenticate() {
    if (props.isAuthenticated[0]()) return;
    if (passwordHash[0]() === userProfile?.passwordHash) {
      props.isAuthenticated[1](true);
    }
  }
}
