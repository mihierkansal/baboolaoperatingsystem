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
  Files,
  TextEditor,
}

export interface FolderFile {
  name: string;
  content: string;
  id: string;
}
export interface Folder {
  name: string;
  files: FolderFile[];
  subfolders: Folder[];
  id: string;
}
export interface Shortcut {
  name: string;
  app?: AppObject;
  filename?: string;
  folderPath?: string;
}
export interface UserProfile {
  name?: string;
  profilePic?: string;
  passwordHash?: string;
  wallpaper?: string;
  customApps?: AppObject[];
  filesFolders?: Folder[];
  desktopShortcuts?: Shortcut[];
}
