import inquirer from "inquirer";
import fs from "fs";
import chalk from "chalk";

import { parseArgumentsIntoOptions } from "./components/parseArguments";
import { installTemplateDependencies } from "./components/installDependencies";
import { modifyJsonFile } from "./components/modifyJsonFiles";
import { createDirectoryContents } from "./components/createDirectoryContents";

const TEMPLATE_NAMES = {
  javascript: "figma-react-plugin-template-js",
  typescript: "figma-react-plugin-template-ts",
};

const CURR_DIR = process.cwd();
let BUILD_DIR;

export const createProjectTemplate = async (args) => {
  let options = parseArgumentsIntoOptions(args);

  // Ask for project name
  console.log(chalk.cyan.bold("What would you like the project to be called?"));
  const project = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Project name:",
      validate: (input) => {
        if (/^([a-z\-\_\d])+$/.test(input)) return true;
        else
          return "Project name may only include lowecase letters, numbers, underscores and hashes.";
      },
    },
  ]);
  setBuildDirectory(options.currentDirectory, project.name);

  // Ask for Figma plugin name
  console.log("");
  console.log(
    chalk.cyan.bold("What would you like the Figma plugin to be called?")
  );
  const plugin = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Figma plugin name:",
      default: project.name,
      validate: (input) => {
        if (/^([A-Za-z\-\_\d ])+$/.test(input)) return true;
        else
          return "Plugin name may only include letters, numbers, underscores, hashes and spaces.";
      },
    },
  ]);

  // Ask for whether the project should be created with JS or TS
  let template;
  if (options.typescript) {
    template = { template: "TypeScript" };
  } else if (options.javascript) {
    template = { template: "JavaScript" };
  } else {
    console.log("");
    console.log(
      chalk.cyan.bold("Which template would you like your project to use?")
    );
    template = await inquirer.prompt([
      {
        name: "template",
        type: "list",
        message: "Template:",
        choices: ["JavaScript", "TypeScript"],
        default: "JavaScript",
      },
    ]);
  }

  triggerProjectCreation(project.name, plugin.name, template.template);

  function triggerProjectCreation(name, plugin, template) {
    console.log("");
    console.log(chalk.green.bold("Creating your project..."));
    console.log("P.S. This might take a bit");
    const projectName = name;
    const pluginName = plugin;

    // Set template based on input args
    let templatePath;
    if (template.toLowerCase() == "javascript") {
      templatePath = `${__dirname}/../templates/${TEMPLATE_NAMES.javascript}`;
    } else if (template.toLowerCase() == "typescript") {
      templatePath = `${__dirname}/../templates/${TEMPLATE_NAMES.typescript}`;
    }

    // Create directory if --currDir flag was not used
    if (!options.currentDirectory) {
      fs.mkdirSync(`${BUILD_DIR}`);
    }

    //Trigger file creation functions
    createDirectoryContents(templatePath, BUILD_DIR);
    modifyJsonFiles(pluginName, projectName, template);
    createGitIgnore(BUILD_DIR);
  }

  function modifyJsonFiles(pluginName, projectName) {
    modifyJsonFile(`${BUILD_DIR}/manifest.json`, pluginName);
    modifyJsonFile(`${BUILD_DIR}/package.json`, projectName);

    installTemplateDependencies(options.currentDirectory, projectName).then(
      (instructions) => {
        // Display info on complete
        console.log("");
        console.log("---------------------");
        console.log("");

        console.log(chalk.green.bold("Project successfully created"));

        console.log(
          chalk`Run '{magenta.bold ${instructions}}' to start the development server.`
        );
        console.log("");
        console.log(
          chalk`Read the {bold Readme} for instructions on how to add your plugin to Figma for development`
        );

        console.log("");
        console.log("---------------------");
      }
    );
  }
};

function setBuildDirectory(currentDirectory, projectName) {
  // Set build directory based on input args
  if (currentDirectory) {
    BUILD_DIR = `${CURR_DIR}`;
  } else {
    BUILD_DIR = `${CURR_DIR}/${projectName}`;
  }
}

function createGitIgnore(directory) {
  const ignorePath = `${directory}/.gitignore`;
  const content = `
.DS_*
*.log
logs
**/*.backup.*
**/*.back.*

node_modules
bower_components

*.sublime*

psd
thumb
sketch`;
  fs.writeFileSync(ignorePath, content, "utf8");
}
