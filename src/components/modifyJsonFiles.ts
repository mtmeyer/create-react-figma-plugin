import editJsonFile from "edit-json-file";

export function modifyJsonFile(path: string, value: string) {
  let jsonFile = editJsonFile(path);
  jsonFile.set("name", value);
  jsonFile.save();
}
