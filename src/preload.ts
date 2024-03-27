// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    minimizeWindow: () => {
        ipcRenderer.send("minimize-window");
    },
    maximizeWindow: () => {
        ipcRenderer.send("maximize-window");
    },
    closeWindow: () => {
        ipcRenderer.send("close-window");
    },
    resizeWindow: () => {
        ipcRenderer.send("resize-window");
    },
    fixedWindow: (isFixed:boolean) => {
        ipcRenderer.send("fixed-window", isFixed);
    },
    onResponse:(channel:any, listener:any) => {
        ipcRenderer.on(channel, listener);
        return () => {
            ipcRenderer.removeListener(channel, listener);
        };
    },
});
