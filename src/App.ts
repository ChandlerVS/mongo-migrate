import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import migrateData from "./eventHandlers/migrateData";

require("electron-reload")(__dirname);

class App {
  mainWindow: BrowserWindow | null = null;

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      title: "Mongo Migrator",
      fullscreenable: false,
      resizable: false,
      darkTheme: true,
      autoHideMenuBar: true,
      width: 800,
      height: 500,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.mainWindow.loadFile(
      path.join(__dirname, "../", "views", "index.html")
    );
  }

  handleEvents() {
    ipcMain.on("migrate", migrateData);
  }

  run() {
    app.whenReady().then(() => {
      if (this.mainWindow === null) this.createMainWindow();
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") app.quit();
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) this.createMainWindow();
    });

    this.handleEvents();
  }
}

export default App;
