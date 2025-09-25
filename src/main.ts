import { app, BrowserWindow, ipcMain } from "electron"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import * as fs from "fs"
import type { Topics } from "./types/topics"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dataFile = join(__dirname, "../data/topics.json")

const ensureDataFile = () => {
  if (!fs.existsSync(dataFile)) {
    const defaultData = fs.readFileSync(
      join(__dirname, "../data/topics.json"),
      "utf8"
    )
    fs.writeFileSync(dataFile, defaultData, "utf8")
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  })

  win.loadFile(join(__dirname, "../public/index.html"))
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ensureDataFile()
  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

// IPC
ipcMain.handle("load-topics", async (): Promise<Topics> => {
  const raw = fs.readFileSync(dataFile, "utf8")
  return JSON.parse(raw) as Topics
})

ipcMain.handle("save-topics", async (_event, topics: Topics): Promise<void> => {
  fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
})

ipcMain.handle("add-topic", async (_event, name: string) => {
  const topics = JSON.parse(fs.readFileSync(dataFile, "utf8"))
  if (!topics[name]) topics[name] = { subtopics: [] }
  fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
})

ipcMain.handle(
  "modify-topic",
  async (_event, oldName: string, newName: string) => {
    const topics = JSON.parse(fs.readFileSync(dataFile, "utf8"))

    if (!topics[oldName]) return
    if (topics[newName]) throw new Error("Topic with new name already exists")

    topics[newName] = { subtopics: topics[oldName].subtopics }
    delete topics[oldName]

    fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
  }
)

ipcMain.handle("delete-topic", async (_event, name: string) => {
  const topics = JSON.parse(fs.readFileSync(dataFile, "utf8"))
  delete topics[name]
  fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
})

ipcMain.handle(
  "add-subtopic",
  async (
    _event,
    topicName: string,
    subtopic: { title: string; desc: string }
  ) => {
    const topics = JSON.parse(fs.readFileSync(dataFile, "utf8"))

    if (!topics[topicName]) topics[topicName] = { subtopics: [] }

    topics[topicName].subtopics.push(subtopic)

    fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
  }
)

ipcMain.handle(
  "modify-subtopic",
  async (
    _event,
    topicName: string,
    subIndex: number,
    newSubtopic: { title: string; desc: string }
  ) => {
    const topics = JSON.parse(fs.readFileSync(dataFile, "utf8"))

    if (!topics[topicName] || !topics[topicName].subtopics[subIndex]) return

    topics[topicName].subtopics[subIndex] = newSubtopic

    fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
  }
)

ipcMain.handle(
  "delete-subtopic",
  async (_event, topicName: string, subIndex: number) => {
    const topics = JSON.parse(fs.readFileSync(dataFile, "utf8"))

    if (!topics[topicName] || !topics[topicName].subtopics[subIndex]) return

    topics[topicName].subtopics.splice(subIndex, 1)

    fs.writeFileSync(dataFile, JSON.stringify(topics, null, 2), "utf8")
  }
)
