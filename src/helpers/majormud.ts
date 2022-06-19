export interface MajorMUDObject {}

export interface MajorMUDVersion extends MajorMUDObject {
  uri: string
  name: string
  author: string
  created_at: Date
  updated_at: Date
}

export interface MajorMUDItem extends MajorMUDObject {
  uri: string
  id: number
  name: string
  description: string
  type: string
  weight: number
  created_at: Date
  updated_at: Date
}
