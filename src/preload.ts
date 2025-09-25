// preload.ts
const { contextBridge, ipcRenderer } = require("electron")

/** Types for TypeScript only */
interface Subtopic {
  title: string
  desc: string
}
interface Topic {
  subtopics: Subtopic[]
}
interface Topics {
  [key: string]: Topic
}

contextBridge.exposeInMainWorld("api", {
  loadTopics: () => ipcRenderer.invoke("load-topics"),
  saveTopics: (topics: Topics) => ipcRenderer.invoke("save-topics", topics),
  addTopic: (name: string) => ipcRenderer.invoke("add-topic", name),
  modifyTopic: (oldName: string, newName: string) =>
    ipcRenderer.invoke("modify-topic", oldName, newName),
  deleteTopic: (name: string) => ipcRenderer.invoke("delete-topic", name),
  addSubtopic: (topicName: string, subtopic: Subtopic) =>
    ipcRenderer.invoke("add-subtopic", topicName, subtopic),
  modifySubtopic: (topicName: string, index: number, subtopic: Subtopic) =>
    ipcRenderer.invoke("modify-subtopic", topicName, index, subtopic),
  deleteSubtopic: (topicName: string, index: number) =>
    ipcRenderer.invoke("delete-subtopic", topicName, index),
})
