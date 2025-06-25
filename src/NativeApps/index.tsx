import { Match, Switch } from "solid-js";
import { AppObject, NativeApp } from "../types";
import { Settings } from "./Settings";
import { Terminal } from "./Terminal";
import { AppInstaller } from "./AddApps";
import { Files } from "./Files";
import TextEditor from "baboolatexteditor/src/App.tsx";

export function NativeAppView(props: { app: AppObject }) {
  console.log(props.app);
  return (
    <Switch>
      <Match when={props.app.mainViewNativeApp === NativeApp.Settings}>
        <Settings {...props.app.nativeAppProps} />
      </Match>
      <Match when={props.app.mainViewNativeApp === NativeApp.Terminal}>
        <Terminal />
      </Match>
      <Match when={props.app.mainViewNativeApp === NativeApp.Installer}>
        <AppInstaller />
      </Match>
      <Match when={props.app.mainViewNativeApp === NativeApp.Files}>
        <Files {...props.app.nativeAppProps} />
      </Match>
      <Match when={props.app.mainViewNativeApp === NativeApp.TextEditor}>
        <div class="baboolastyles">
          <TextEditor />
        </div>
      </Match>
    </Switch>
  );
}
