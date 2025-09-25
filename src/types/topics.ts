export interface Subtopic {
  title: string
  desc: string
}

export interface Topic {
  subtopics: Subtopic[]
}

export interface Topics {
  [key: string]: Topic
}
