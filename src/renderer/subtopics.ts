import type { Subtopic, Topics } from "../types/topics"

const list = document.getElementById("subtopicsList")!
const titleH1 = document.getElementById("topicTitle")!
const addBtn = document.getElementById("addSubtopicBtn")!
const titleInput = document.getElementById(
  "newSubtopicTitle"
) as HTMLInputElement
const descInput = document.getElementById("newSubtopicDesc") as HTMLInputElement

const modal = document.getElementById("modal")!
const modalTitle = document.getElementById("modalTitle")!
const modalDesc = document.getElementById("modalDesc")!
const closeBtn = document.getElementById("closeBtn")!

const editModal = document.getElementById("editSubModal")!
const editTitleInput = document.getElementById(
  "editSubTitle"
) as HTMLInputElement
const editDescInput = document.getElementById("editSubDesc") as HTMLInputElement
const saveEditBtn = document.getElementById("saveSubEditBtn")!
let currentEditIndex = -1

let topics: Topics = {}
let currentTopic = ""
let subtopics: Subtopic[] = []

// Render subtopics
const renderSubtopics = () => {
  list.innerHTML = ""
  subtopics.forEach((st, idx) => {
    const div = document.createElement("div")
    div.className = "subtopic"
    div.innerText = st.title

    // Show description popup
    div.onclick = () => {
      modalTitle.innerText = st.title
      modalDesc.innerText = st.desc
      modal.style.display = "block"
    }

    // Edit button
    const editBtn = document.createElement("button")
    editBtn.innerText = "✏️"
    editBtn.onclick = (e) => {
      e.stopPropagation()
      currentEditIndex = idx
      editTitleInput.value = st.title
      editDescInput.value = st.desc
      editModal.style.display = "block"
    }

    // Delete button
    const delBtn = document.createElement("button")
    delBtn.innerText = "🗑️"
    delBtn.onclick = async (e) => {
      e.stopPropagation()
      await window.api.deleteSubtopic(currentTopic, idx)
      topics = await window.api.loadTopics()
      subtopics = topics[currentTopic]?.subtopics || []
      renderSubtopics()
    }

    div.appendChild(editBtn)
    div.appendChild(delBtn)
    list.appendChild(div)
  })
}

// Add subtopic
addBtn.onclick = async () => {
  const t = titleInput.value.trim()
  const d = descInput.value.trim()
  if (!t || !d) return

  await window.api.addSubtopic(currentTopic, { title: t, desc: d })
  titleInput.value = ""
  descInput.value = ""
  topics = await window.api.loadTopics()
  subtopics = topics[currentTopic]?.subtopics || []
  renderSubtopics()
}

// Save edited subtopic
saveEditBtn.onclick = async () => {
  const newTitle = editTitleInput.value.trim()
  const newDesc = editDescInput.value.trim()
  if (!newTitle || !newDesc) return

  await window.api.modifySubtopic(currentTopic, currentEditIndex, {
    title: newTitle,
    desc: newDesc,
  })

  editModal.style.display = "none"
  topics = await window.api.loadTopics()
  subtopics = topics[currentTopic]?.subtopics || []
  renderSubtopics()
}

// Modal close handlers
closeBtn.onclick = () => (modal.style.display = "none")
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none"
  if (e.target === editModal) editModal.style.display = "none"
}

// Load subtopics on page load
window.onload = async () => {
  topics = await window.api.loadTopics()
  currentTopic = localStorage.getItem("selectedTopic")!
  titleH1.innerText = currentTopic
  subtopics = topics[currentTopic]?.subtopics || []
  renderSubtopics()
}
