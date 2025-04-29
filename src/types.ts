import { Signal } from "solid-js";

export type WindowID = string;

export interface AppObject {
  title: string;
  icon: string;
  isLink?: boolean;
  preferredWindowSize?: { width: number; height: number };

  /** Either URL or MainViewJSX*/
  url?: string;
  /** Either URL or MainViewJSX*/
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
}

export interface UserProfile {
  name?: string;
  profilePic?: string;
  passwordHash?: string;
  wallpaper?: string;
}
