import type { Topics } from "./topics"

export {}

declare global {
  interface Window {
    api: {
      // Topics
      loadTopics: () => Promise<Topics>
      saveTopics: (topics: Topics) => Promise<void>
      addTopic: (name: string) => Promise<void>
      modifyTopic: (oldName: string, newName: string) => Promise<void>
      deleteTopic: (name: string) => Promise<void>

      // Subtopics
      addSubtopic: (topicName: string, subtopic: Subtopic) => Promise<void>
      modifySubtopic: (
        topicName: string,
        index: number,
        subtopic: Subtopic
      ) => Promise<void>
      deleteSubtopic: (topicName: string, index: number) => Promise<void>
    }
  }
}
