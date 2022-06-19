export interface MajorMUDObject {}

export interface MajorMUDVersion extends MajorMUDObject {
  name: string
  uri: string
}

export interface MajorMUDItem extends MajorMUDObject {
  version: string
  id: number
  uri: string
}
