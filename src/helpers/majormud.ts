export interface MajorMUDObject {}

export interface MajorMUDVersion extends MajorMUDObject {
  name: string
  uri: string
  author: string
  created_at: Date
  updated_at: Date
}

export interface MajorMUDItem extends MajorMUDObject {
  id: number
  uri: string
  name: string
  description: string
  type: string
  weight: number
  created_at: Date
  updated_at: Date
}
