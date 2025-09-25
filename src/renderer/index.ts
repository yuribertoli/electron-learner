import type { Topics } from "../types/topics"

const topicsList = document.getElementById("topicsList")!
const addTopicBtn = document.getElementById("addTopicBtn")!
const newTopicInput = document.getElementById(
  "newTopicInput"
) as HTMLInputElement

const editModal = document.getElementById("editModal")!
const editInput = document.getElementById("editTopicInput") as HTMLInputElement
const saveEditBtn = document.getElementById("saveEditBtn")!
let currentEditTopic = ""

let topics: Topics = {}

// Render topics list
const renderTopics = () => {
  topicsList.innerHTML = ""
  Object.keys(topics).forEach((name) => {
    const div = document.createElement("div")
    div.className = "topic-item"
    div.innerText = name

    // Click to open subtopics page
    div.onclick = () => {
      localStorage.setItem("selectedTopic", name)
      window.location.href = "subtopics.html"
    }

    // Edit button
    const editBtn = document.createElement("button")
    editBtn.innerText = "✏️"
    editBtn.onclick = (e) => {
      e.stopPropagation()
      currentEditTopic = name
      editInput.value = name
      editModal.style.display = "block"
    }

    // Delete button
    const delBtn = document.createElement("button")
    delBtn.innerText = "🗑️"
    delBtn.onclick = async (e) => {
      e.stopPropagation()
      await window.api.deleteTopic(name)
      topics = await window.api.loadTopics()
      renderTopics()
    }

    div.appendChild(editBtn)
    div.appendChild(delBtn)
    topicsList.appendChild(div)
  })
}

// Add new topic
addTopicBtn.onclick = async () => {
  const name = newTopicInput.value.trim()
  if (!name) return
  await window.api.addTopic(name)
  newTopicInput.value = ""
  topics = await window.api.loadTopics()
  renderTopics()
}

// Save topic rename
saveEditBtn.onclick = async () => {
  const newName = editInput.value.trim()
  if (!newName) return
  await window.api.modifyTopic(currentEditTopic, newName)
  editModal.style.display = "none"
  topics = await window.api.loadTopics()
  renderTopics()
}

// Close modal on outside click
window.onclick = (e) => {
  if (e.target === editModal) editModal.style.display = "none"
}

// Load topics on page load
window.onload = async () => {
  topics = await window.api.loadTopics()
  renderTopics()
}
