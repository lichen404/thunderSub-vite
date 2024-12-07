import { app, BrowserWindow, ipcMain, shell } from 'electron';
import ffmpeg, { ffprobe } from 'fluent-ffmpeg'
import axios from "axios";
import os from 'os';
import path from "path";
import fs from "fs";
import { gcidHashFile, cidHashFile } from './libs/hash';

const subPath = `${os.homedir()}/Documents/ThunderSub`

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffprobePath = require('ffprobe-static').path.replace(
  'app.asar',
  'app.asar.unpacked'
)

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const instance = axios.create({
  baseURL: 'http://api-shoulei-ssl.xunlei.com/',
  timeout: 1000 * 60 * 3
})


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  ipcMain.handle('upload-file', async (event, payload) => {
    const videoPath = process.platform === 'win32' ? payload.videoPath.replace(/\\/g, '/') : payload.videoPath
    const videoLength = await new Promise((resolve, reject) => {
      ffprobe(videoPath, (error: any, metadata: any) => {
        error ? reject(error) : resolve(metadata.format.duration);
      })
    })
    const hashPayload = await new Promise<{ cidHash: string, gcidHash: string }>((resolve) => cidHashFile(videoPath, (cidHash) => {
      gcidHashFile(videoPath, gcidHash => resolve({ cidHash, gcidHash }))
    }))
    try {
      const { data } = await instance.get('oracle/subtitle',
        {
          params: {
            name: payload.videoName,
            cid: hashPayload.cidHash,
            gcid: hashPayload.gcidHash,
            duration: (parseFloat(videoLength as string) * 1000).toString()
          }

        }
      )
      return data
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }


  })


  ipcMain.handle('download-sub', async (event, { name, url }: { name: string, url: string }) => {
    if (!fs.existsSync(subPath)) {
      fs.mkdirSync(subPath);
    }
    if (url) {
      const myPath = path.resolve(subPath, name);
      const writer = fs.createWriteStream(myPath);
      const response = await axios.get(url, {
        responseType: 'stream'
      })
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {

        writer.on('finish', () => resolve(myPath))
        writer.on('error', () => reject())

      })

    }
  })

  ipcMain.handle('open-explore', (event, filePath) => {
    if (fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath)
      return true

    }
    return false

  })

  ipcMain.on('close-window', () => {
    mainWindow.close()
  })

  ipcMain.on('maximize-window', () => {


    mainWindow.maximize()

  })


  ipcMain.on('fixed-window', (event, isFixed: boolean) => {
    mainWindow.setAlwaysOnTop(isFixed)
  })

  ipcMain.on('resize-window', () => {
    mainWindow.restore()
  })

  ipcMain.on('minimize-window', () => {

    mainWindow.minimize()
  })

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

