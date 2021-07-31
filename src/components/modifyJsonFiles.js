import editJsonFile from "edit-json-file";

export function modifyJsonFile(path, value) {
  let jsonFile = editJsonFile(path);
  jsonFile.set("name", value);
  jsonFile.save();
}
