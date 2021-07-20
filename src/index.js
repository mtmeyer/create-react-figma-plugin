import inquirer from "inquirer";
import { exec } from "child_process";
import fs from "fs";
import arg from "arg";
import chalk from "chalk";
import ora from "ora";
import editJsonFile from "edit-json-file";

const TEMPLATE_NAMES = {
  javascript: "figma-react-plugin-template-js",
  typescript: "figma-react-plugin-template-ts",
};

export const createProjectTemplate = (args) => {
  let options = parseArgumentsIntoOptions(args);
  const CURR_DIR = process.cwd();
  let BUILD_DIR;

  //Ask for project name
  console.log(chalk.cyan.bold("What would you like the project to be called?"));
  inquirer
    .prompt([
      {
        name: "projectName",
        type: "input",
        message: "Project name:",
        validate: (input) => {
          if (/^([a-z\-\_\d])+$/.test(input)) return true;
          else
            return "Project name may only include lowecase letters, numbers, underscores and hashes.";
        },
      },
    ])
    .then((name) => {
      // Set build directory based on input args
      if (options.currentDirectory) {
        BUILD_DIR = `${CURR_DIR}`;
        console.log("build dir");
        console.log(BUILD_DIR);
      } else {
        BUILD_DIR = `${CURR_DIR}/${name.projectName}`;
        console.log("build dir");
        console.log(BUILD_DIR);
      }

      // Ask for Figma plugin name
      console.log("");
      console.log(
        chalk.cyan.bold("What would you like the Figma plugin to be called?")
      );
      inquirer
        .prompt([
          {
            name: "pluginName",
            type: "input",
            message: "Figma plugin name:",
            default: name.projectName,
            validate: (input) => {
              if (/^([A-Za-z\-\_\d ])+$/.test(input)) return true;
              else
                return "Plugin name may only include letters, numbers, underscores, hashes and spaces.";
            },
          },
        ])
        .then((plugin) => {
          // Ask for whether the project should be created with JS or TS
          if (!options.typescript && !options.javascript) {
            console.log("");
            inquirer
              .prompt([
                {
                  name: "template",
                  type: "list",
                  message: "Please choose which template to use",
                  choices: ["JavaScript", "TypeScript"],
                  default: "JavaScript",
                },
              ])
              .then((template) => {
                triggerProjectCreation(
                  name.projectName,
                  plugin.pluginName,
                  template.template
                );
              });
          } else {
            if (options.typescript) {
              triggerProjectCreation(
                name.projectName,
                plugin.pluginName,
                "TypeScript"
              );
            } else if (options.javascript) {
              triggerProjectCreation(
                name.projectName,
                plugin.pluginName,
                "javascript"
              );
            } else {
              triggerProjectCreation(
                name.projectName,
                plugin.pluginName,
                "javascript"
              );
            }
          }
        });
    });

  const triggerProjectCreation = (name, plugin, template) => {
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
    createJsonFiles(pluginName, projectName, template);
    createGitIgnore(BUILD_DIR);
  };

  const createDirectoryContents = (templatePath, newProjectPath) => {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach((file) => {
      const origFilePath = `${templatePath}/${file}`;

      // Get current file info
      const stats = fs.statSync(origFilePath);

      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, "utf8");

        const writePath = `${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, "utf8");
      } else if (stats.isDirectory()) {
        // Create subfolders with contents
        fs.mkdirSync(`${newProjectPath}/${file}`);

        createDirectoryContents(
          `${templatePath}/${file}`,
          `${newProjectPath}/${file}`
        );
      }
    });
  };

  const createJsonFiles = (pluginName, projectName, template) => {
    //Edit manifest.json
    const manifestPath = `${BUILD_DIR}/manifest.json`;
    let manifestFile = editJsonFile(manifestPath);
    manifestFile.set("name", pluginName);
    manifestFile.save();

    //Edit package.json
    const packagePath = `${BUILD_DIR}/package.json`;
    let packageFile = editJsonFile(packagePath);
    packageFile.set("name", projectName);
    packageFile.save();

    //Initialise loading spinner
    console.log("");
    const spinner = ora("Installing packages").start();
    spinner.color = "blue";
    spinner.text = "Installing packages";

    //Run npm install
    let command;
    let completionInstruction;
    if (options.currentDirectory) {
      command = `npm install`;
      completionInstruction = `npm run dev`;
    } else {
      command = `cd ${projectName} && npm install`;
      completionInstruction = `cd ${projectName} && npm run dev`;
    }

    let installCommand = exec(command, function (err, stdout, stderr) {
      spinner.stop();
      console.log("");
      console.log("---------------------");
      console.log("");

      console.log(chalk.green.bold("Project successfully created"));

      console.log(
        chalk`Run '{magenta.bold ${completionInstruction}}' to start the development server.`
      );
      console.log("");
      console.log(
        chalk`Read the {bold Readme} for instructions on how to add your plugin to Figma for development`
      );

      console.log("");
      console.log("---------------------");
      if (err) throw err;
    });
  };
};

const createGitIgnore = (directory) => {
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
};

// Define input arguments
export const parseArgumentsIntoOptions = (rawArgs) => {
  //TODO handle when user inputs both --ts & --js
  const args = arg(
    {
      "--typescript": Boolean,
      "--javascript": Boolean,
      "--currDir": Boolean,
      "--currentDirectory": "--currDir",
      "--ts": "--typescript",
      "--js": "--javascript",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    typescript: args["--typescript"] || false,
    javascript: args["--javascript"] || false,
    currentDirectory: args["--currDir"] || false,
  };
};
