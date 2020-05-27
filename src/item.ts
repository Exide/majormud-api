import { MajorMUDObject } from './majormud-object';

export default interface Item extends MajorMUDObject {
  version: string
  id: number
}
