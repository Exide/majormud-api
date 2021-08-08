export interface MajorMUDObject {}

export interface MajorMUDVersion extends MajorMUDObject {
  name: string
}

export interface MajorMUDItem extends MajorMUDObject {
  version: string
  id: number
}
