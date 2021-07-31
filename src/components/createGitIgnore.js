import fs from "fs";
import http from "https";

export function createGitIgnore(directory) {
  const file = fs.createWriteStream(`${directory}/.gitignore`);
  const request = http.get(
    "https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore",
    (response) => {
      response.pipe(file);
    }
  );
}
