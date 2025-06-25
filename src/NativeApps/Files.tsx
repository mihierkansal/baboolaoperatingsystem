import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  Show,
} from "solid-js";
import { Folder, FolderFile } from "../types";
import {
  downloadTextFile,
  getUserProfile,
  updateShortcutsInLS,
  updateUserProfile,
} from "../utils";
import { promptUser } from "../Components/Dialogs";
import { shortcuts } from "../App";

const INITIAL_FOLDERS: Folder[] = [
  {
    name: "Filesystem Root",
    id: "c8e9rw3",
    files: [],

    subfolders: [
      {
        name: "Documents",
        files: [],
        id: "cnajVp39",
        subfolders: [
          {
            name: "Important",
            files: [
              {
                name: "helloworld.txt",
                content: "Hello World. Edit this text!",
                id: "ce87wq0",
              },
            ],
            id: "5432tvaq",

            subfolders: [
              {
                id: "5431n5431",

                name: "Work",
                files: [],
                subfolders: [],
              },
              {
                id: "4321f31rtf",

                name: "School",
                files: [],
                subfolders: [],
              },
            ],
          },
        ],
      },
    ],
  },
];
export function Files(props: any) {
  let profile = getUserProfile();
  const foldersAndFiles = createSignal<Folder[]>(profile?.filesFolders || []);

  if (!foldersAndFiles[0]().length) {
    foldersAndFiles[1](INITIAL_FOLDERS);
  }

  createEffect(() => {
    updateUserProfile({
      ...(getUserProfile() || {}),
      filesFolders: foldersAndFiles[0](),
    });
  });

  const foundFolder = props.folderPath
    ? findFolderByPath(
        foldersAndFiles[0](),
        "Filesystem Root/" + props.folderPath
      )
    : undefined;

  const selectedFolderID = createSignal(
    foundFolder?.id || foldersAndFiles[0]()[0].id
  );

  const selectedFolder = createMemo(() => {
    console.log("memoran");
    return findFolderById(foldersAndFiles[0](), selectedFolderID[0]());
  });
  const preview = createSignal<FolderFile | undefined>(
    selectedFolder()?.files.find((file) => file.name === props.filename)
  );

  if (!foundFolder && props.folderPath) {
    alert(
      "BaboolaOS cannot find the path specified. Path: " + props.folderPath
    );
  }

  return (
    <div class="app-container">
      <div class="folder-tree">
        <FolderTree folders={foldersAndFiles[0]()} />
      </div>
      <div class="app-main">
        <h3
          style={{
            display: "flex",
          }}
        >
          {selectedFolder()?.name}

          <div
            style={{
              display: "flex",
              "flex-grow": "1",
              "justify-content": "flex-end",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => {
                updateFoldersAndFiles((v) => {
                  const f = findFolderById(v, selectedFolderID[0]())!;

                  f.files = [
                    {
                      id: generateRandomString(9),
                      name: "untitled.txt",
                      content: "Edit this text",
                    },
                    ...f.files,
                  ];

                  return [...v];
                });
              }}
            >
              <span>New File</span>
            </button>
            <button
              onClick={() => {
                updateFoldersAndFiles((v) => {
                  const f = findFolderById(v, selectedFolderID[0]())!;

                  f.subfolders = [
                    {
                      id: generateRandomString(9),
                      name: "Folder",
                      files: [],
                      subfolders: [],
                    },
                    ...f.subfolders,
                  ];

                  return [...v];
                });
              }}
            >
              <span>New Folder</span>
            </button>
          </div>
        </h3>
        <div class="folder-contents">
          <For each={selectedFolder()?.subfolders}>
            {(subfolder) => {
              const contextMenuVis = createSignal(false);
              return (
                <div
                  ondblclick={() => {
                    preview[1](undefined);
                    selectedFolderID[1](subfolder.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();

                    contextMenuVis[1](true);
                  }}
                >
                  <Show when={contextMenuVis[0]()}>
                    <div class="context-menu">
                      <div
                        onClick={async () => {
                          contextMenuVis[1](false);
                          promptUser("Enter new name for file").then(
                            (newName) => {
                              updateFoldersAndFiles((v) => {
                                const f = findFolderById(v, subfolder.id)!;
                                f.name = newName;
                                return [...v];
                              });
                            }
                          );
                        }}
                      >
                        Rename
                      </div>
                      <div
                        style={{
                          "white-space": "nowrap",
                        }}
                        onClick={() => {
                          contextMenuVis[1](false);
                          shortcuts[1]((v) => {
                            v.push({
                              name: subfolder.name,
                              folderPath: pathForFolder(
                                // Don't start in filesystem root
                                foldersAndFiles[0]()[0].subfolders,
                                subfolder
                              )!,
                            });

                            return [...v];
                          });

                          updateShortcutsInLS(shortcuts[0]());
                        }}
                      >
                        Make shortcut
                      </div>
                      <div
                        onClick={() => {
                          updateFoldersAndFiles((v) => {
                            const folder = findFolderById(
                              v,
                              selectedFolderID[0]()
                            )!;

                            folder.subfolders = folder.subfolders.filter(
                              (f) => f.id !== subfolder.id
                            );
                            return [...v];
                          });
                        }}
                      >
                        Delete
                      </div>
                      <div
                        onClick={() => {
                          contextMenuVis[1](false);
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                  </Show>
                  <img src="/folder.png" height={50} width={65} />
                  <div spellcheck={false}>{subfolder.name}</div>
                </div>
              );
            }}
          </For>
          <Index each={selectedFolder()?.files}>
            {(file) => {
              const contextMenuVis = createSignal(false);

              return (
                <div
                  ondblclick={() => {
                    preview[1](file());
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();

                    contextMenuVis[1](true);
                  }}
                >
                  <Show when={contextMenuVis[0]()}>
                    <div class="context-menu">
                      <div
                        onClick={async () => {
                          contextMenuVis[1](false);
                          promptUser("Enter new name for file").then(
                            (newName) => {
                              updateFoldersAndFiles((v) => {
                                const f = findFileById(v, file().id)!;
                                f.name = newName;
                                return [...v];
                              });
                            }
                          );
                        }}
                      >
                        Rename
                      </div>
                      <div
                        style={{
                          "white-space": "nowrap",
                        }}
                        onClick={() => {
                          contextMenuVis[1](false);
                          shortcuts[1]((v) => {
                            v.push({
                              name: file().name,
                              folderPath: pathForFolder(
                                // Don't start in filesystem root
                                foldersAndFiles[0]()[0].subfolders,
                                selectedFolder()!
                              )!,
                              filename: file().name,
                            });

                            return [...v];
                          });

                          updateShortcutsInLS(shortcuts[0]());
                        }}
                      >
                        Make shortcut
                      </div>
                      <div
                        onClick={() => {
                          updateFoldersAndFiles((v) => {
                            const folder = findFolderById(
                              v,
                              selectedFolderID[0]()
                            )!;

                            folder.files = folder.files.filter(
                              (f) => f.id !== file().id
                            );
                            return [...v];
                          });
                        }}
                      >
                        Delete
                      </div>
                      <div
                        onClick={() => {
                          contextMenuVis[1](false);
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                  </Show>
                  <img src="/file.png" height={50} />
                  <div spellcheck={false}>{file().name}</div>
                </div>
              );
            }}
          </Index>
        </div>
      </div>
      <Show when={preview[0]()}>
        <div class="file-preview">
          <div
            style={{
              display: "flex",
              "justify-content": "flex-end",
            }}
          >
            <span
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                preview[1](undefined);
              }}
            >
              ✕
            </span>
          </div>
          <h3
            onInput={(e) => {
              updateFoldersAndFiles((v) => {
                findFileById(v, preview[0]()!.id)!.name = (
                  e.target as HTMLHeadingElement
                ).innerText;

                return [...v];
              });
            }}
            contentEditable
          >
            {preview[0]()?.name}
          </h3>
          <textarea
            style={{
              "margin-bottom": "1rem",
              height: "20rem",
            }}
            onInput={(e) => {
              updateFoldersAndFiles((v) => {
                findFileById(v, preview[0]()!.id)!.content = e.target.value;
                return [...v];
              });
            }}
            value={preview[0]()?.content}
          ></textarea>
          <button
            onClick={() => {
              downloadTextFile(preview[0]()!.name, preview[0]()!.content);
            }}
          >
            <span>Download</span>
          </button>
        </div>
      </Show>
    </div>
  );

  function FolderTree(props: { folders: Folder[] }) {
    return (
      <For each={props.folders}>
        {(folder) => {
          return (
            <div>
              <div
                onClick={() => {
                  selectedFolderID[1](folder.id);
                }}
                class={
                  "folder-button " +
                  (selectedFolderID[0]() === folder.id ? "active" : "")
                }
              >
                {folder.name}
              </div>

              <Show when={folder.subfolders.length}>
                <div
                  style={{
                    "padding-left": "1rem",
                  }}
                >
                  {<FolderTree folders={folder.subfolders} />}
                </div>
              </Show>
            </div>
          );
        }}
      </For>
    );
  }

  function updateFoldersAndFiles(updateFn: (old: Folder[]) => Folder[]) {
    const oldFF = foldersAndFiles[0]();
    foldersAndFiles[1]([]);
    foldersAndFiles[1](() => {
      return updateFn(oldFF);
    });
  }
}

function pathForFolder(folders: Folder[], folder: Folder): string | null {
  function search(
    currentFolders: Folder[],
    currentPath: string
  ): string | null {
    for (const f of currentFolders) {
      const newPath = currentPath ? `${currentPath}/${f.name}` : f.name;

      if (f.id === folder.id) {
        return newPath;
      }

      const subfolderPath = search(f.subfolders, newPath);
      if (subfolderPath) {
        return subfolderPath;
      }
    }

    return null;
  }

  return search(folders, "");
}

function findFolderByPath(folders: Folder[], path: string): Folder | null {
  const pathSegments = path.split("/").filter((segment) => segment.length > 0);

  function search(currentFolders: Folder[], index: number): Folder | null {
    if (index >= pathSegments.length) {
      return null;
    }

    const folderName = pathSegments[index];

    for (const folder of currentFolders) {
      if (folder.name === folderName) {
        if (index === pathSegments.length - 1) {
          return folder;
        }
        return search(folder.subfolders, index + 1);
      }
    }

    return null;
  }

  return search(folders, 0);
}

function findFileById(
  folders: Folder[],
  fileId: string
): FolderFile | undefined {
  for (const folder of folders) {
    // Check the files in the current folder
    for (const file of folder.files) {
      if (file.id === fileId) {
        return file;
      }
    }

    // Search recursively in subfolders
    const found = findFileById(folder.subfolders, fileId);
    if (found) {
      return found;
    }
  }
}
function findFolderById(folders: Folder[], folderId: string): Folder | null {
  for (const folder of folders) {
    if (folder.id === folderId) {
      return folder;
    }

    // Search recursively in subfolders
    const found = findFolderById(folder.subfolders, folderId);
    if (found) {
      return found;
    }
  }

  return null;
}

function generateRandomString(length: number) {
  return Math.random().toString(36).substring(2, length);
}
