import { showSuccessModal } from "../Components/Dialogs";
import { AppObject } from "../types";
import { getUserProfile, updateUserProfile } from "../utils";

export function AppInstaller() {
  let urlInp!: HTMLInputElement;
  let nameInp!: HTMLInputElement;
  let iconInp!: HTMLInputElement;

  return (
    <>
      <div class="app-container ">
        <div class="app-main">
          <h3>Install App</h3>
          <p>
            Install a website or locally saved HTML file as an app. Note that
            due to CORS restrictions, some websites may not work when installed
            as an app directly in BaboolaOS. If that is the case, please
            uninstall and reinstall the app using the <i>Save as Link</i> option
            and the app will now open as a link.
          </p>

          <label>
            Website URL or HTML file path
            <input
              ref={urlInp}
              type="text"
              placeholder="URL or file path for the app to install..."
            />
          </label>
          <label>
            App Name{" "}
            <input
              ref={nameInp}
              type="text"
              placeholder="Any name of your choice..."
            />
          </label>
          <label>
            Upload icon for app (optional)
            <input type="file" ref={iconInp} />
          </label>

          <div class="buttons">
            <button
              onClick={async () => {
                addApp({
                  isLink: false,
                });
              }}
            >
              <span>Install App</span>
            </button>
            <button
              onClick={async () => {
                addApp({
                  isLink: true,
                });
              }}
            >
              <span>Save as link</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
  function addApp({ isLink }: { isLink: boolean }) {
    const icon = iconInp.files?.[0];

    if (icon && icon.size < 131072) {
      const fr = new FileReader();
      fr.onload = (e) => {
        const icon = e.target!.result;

        base({
          isLink,
          icon: icon as string,
        });
      };
      fr.readAsDataURL(icon);
    } else {
      base({
        icon: "/executable.png",
        isLink,
      });
    }

    function base({ icon, isLink }: { icon: string; isLink: boolean }) {
      const profile = getUserProfile();

      const newApp: AppObject = {
        isCustom: true,
        url: urlInp.value,
        icon,
        isLink,
        title: nameInp.value,
      };

      let existingCustomApps = [...(profile?.customApps || [])];

      updateUserProfile({
        ...profile,
        customApps: [...existingCustomApps, newApp],
      });

      showSuccessModal("Done. Find the app in the Apps menu.");
      nameInp.value = "";
      urlInp.value = "";
    }
  }
}
