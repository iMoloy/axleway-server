import { ObjectId } from "mongodb";

export function getObjectId(id) {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

