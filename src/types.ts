import { Signal } from "solid-js";

export type WindowID = string;

export interface AppObject {
  title: string;
  icon: string;
  isLink?: boolean;
  isCustom?: boolean;
  preferredWindowSize?: { width: number; height: number };

  url?: string;
  mainViewNativeApp?: NativeApp;
  nativeAppProps?: any;
}

export interface WindowObject extends AppObject {
  id: WindowID;
  hidden: Signal<boolean>;
}
export enum NativeApp {
  Settings,
  Terminal,
  Installer,
}

export interface UserProfile {
  name?: string;
  profilePic?: string;
  passwordHash?: string;
  wallpaper?: string;
  customApps?: AppObject[];
}
