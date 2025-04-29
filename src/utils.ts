import { Signal, createSignal } from "solid-js";
import { AppObject, UserProfile, WindowObject } from "./types";
import CryptoJS from "crypto-js";

export const wallpapers = [
  "/wallpapernature.png",
  "/wallpaperblue.png",
  "/wallpaperdark.png",
  "/wallpapercatsleeping.png",
  "/wallpaperkittens.jpg",
  "/wallpapermountains.png",
  "/wallpaperarchitecture.png",
  "/wallpaperguitar.png",
  "/wallpaperroses.png",
  "/wallpaperglowingbutterflies.png",
];

export const profilePics = [
  "/soccer.png",
  "/cat.png",
  "/puppy.png",
  "/flower.png",
  "/architecture.png",
  "/car.png",
  "/guitar.png",
  "/ukulele.png",
  "/matrix.png",
  "/butterfly.png",
];

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function generateRandomNumberFrom(lowest: number, greatest: number) {
  return lowest + Math.ceil(Math.random() * (greatest - lowest));
}
export function launchApp(
  appObject: AppObject,
  openWindowsList: Signal<WindowObject[]>
) {
  if (appObject.isLink) {
    open(appObject.url);
  } else {
    openWindowsList[1]((v) => {
      v.push({
        ...appObject,
        hidden: createSignal(false),
        id: generateRandomString(9),
      });
      return [...v];
    });
  }
}

export function generateAscendingArray(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

export function checkDateEquals(date1: Date, date2: Date) {
  return date1.toLocaleDateString() === date2.toLocaleDateString();
}

export function formatDateToLocalISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isN1ApproxN2(n1: number, n2: number, moreOrLess: number) {
  if (n1 >= n2 - moreOrLess && n1 <= n2 + moreOrLess) {
    return true;
  } else {
    return false;
  }
}

export function formatDateAsTime(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function getPinnedApps() {
  const lsi = localStorage.getItem("bab_pinned_apps");

  if (lsi) {
    return JSON.parse(lsi) as AppObject[];
  }
  return undefined;
}

export function addAppToLocalStorePinned(app: AppObject) {
  const existing = getPinnedApps();

  if (existing) {
    localStorage.setItem("bab_pinned_apps", JSON.stringify([...existing, app]));
  } else {
    localStorage.setItem("bab_pinned_apps", JSON.stringify([app]));
  }
}

export function removeAppFromLocalStorePinned(appName: string) {
  const existing = getPinnedApps();

  if (existing) {
    localStorage.setItem(
      "bab_pinned_apps",
      JSON.stringify(existing.filter((app) => app.title !== appName))
    );
  } else {
    // do nothing
  }
}

export function getUserProfile() {
  return localStorage.getItem("bab_user_profile")
    ? (JSON.parse(localStorage.getItem("bab_user_profile")!) as UserProfile)
    : undefined;
}

export function updateUserProfile(newProfile: UserProfile | undefined) {
  if (newProfile) {
    localStorage.setItem("bab_user_profile", JSON.stringify(newProfile));
  } else {
    localStorage.removeItem("bab_user_profile");
  }
}

export function hashString(input: string) {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

export function applyWallpaper() {
  const userProfile = getUserProfile();

  if (userProfile?.wallpaper) {
    document.body.style.backgroundImage = `url('${userProfile.wallpaper}')`;
  } else {
    document.body.style.backgroundImage = `url('${wallpapers[0]}')`;
  }
}

export function downloadTextFile(filename: string, content: string) {
  const element = document.createElement("a");
  const blob = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(blob);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
