import ora from "ora";
import { exec } from "child_process";

export function installTemplateDependencies(
  currentDirectory: boolean,
  projectName: string
) {
  return new Promise(async (resolve, reject) => {
    //Initialise loading spinner
    console.log("");
    const spinner = ora("Installing packages").start();
    spinner.color = "blue";
    spinner.text = "Installing packages";

    //Set command and completion instructions
    let command: string;
    let completionInstruction: string;
    if (currentDirectory) {
      command = `npm install`;
      completionInstruction = `npm run dev`;
    } else {
      command = `cd ${projectName} && npm install`;
      completionInstruction = `cd ${projectName} && npm run dev`;
    }

    // Install project dependencies
    const install = await exec(command, function (err, stdout, stderr) {
      spinner.stop();
      resolve(completionInstruction);

      if (stderr) reject(stderr);
      if (err) reject(err);
    });
  });
}
