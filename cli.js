import inquirer from "inquirer";
import { exec } from "child_process";
import fs from "fs";
import arg from "arg";
import chalk from "chalk";
import ora from "ora";

import templates from "./jsonTemplates.js";

const TEMPLATE_NAMES = {
  javascript: "figma-react-plugin-template-js",
  typescript: "figma-react-plugin-template-ts",
};

export const createProjectTemplate = (args) => {
  let options = parseArgumentsIntoOptions(args);
  const CURR_DIR = process.cwd();
  let BUILD_DIR;

  console.log(chalk.cyan.bold("What would you like project to be called?"));
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
      if (options.currentDirectory) {
        BUILD_DIR = `${CURR_DIR}`;
      } else {
        BUILD_DIR = `${CURR_DIR}/${name.projectName}`;
      }

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

    let templatePath;
    if (template.toLowerCase() == "javascript") {
      templatePath = `${__dirname}/templates/${TEMPLATE_NAMES.javascript}`;
    } else if (template.toLowerCase() == "typescript") {
      templatePath = `${__dirname}/templates/${TEMPLATE_NAMES.typescript}`;
    }

    if (!options.currentDirectory) {
      fs.mkdirSync(`${CURR_DIR}/${projectName}`);
    }

    createDirectoryContents(templatePath, projectName);
    createJsonFiles(pluginName, projectName, template);
  };

  const createDirectoryContents = (templatePath, newProjectPath) => {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach((file) => {
      const origFilePath = `${templatePath}/${file}`;

      // get stats about the current file
      const stats = fs.statSync(origFilePath);

      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, "utf8");

        const writePath = `${BUILD_DIR}/${file}`;
        fs.writeFileSync(writePath, contents, "utf8");
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${BUILD_DIR}/${file}`);

        // recursive call
        createDirectoryContents(
          `${templatePath}/${file}`,
          `${newProjectPath}/${file}`
        );
      }
    });
  };

  const createJsonFiles = (pluginName, projectName, template) => {
    //Generate manifest.json
    const manifestPath = `${BUILD_DIR}/manifest.json`;
    const manifestJson = templates.getManifestJson(pluginName);
    fs.writeFileSync(manifestPath, manifestJson, "utf8");

    //Generate package.json
    let packageJson;
    if (template.toLowerCase() == "javascript") {
      packageJson = templates.getPackageJson(projectName, false);
    } else if (template.toLowerCase() == "typescript") {
      packageJson = templates.getPackageJson(projectName, true);
    }
    const packagePath = `${BUILD_DIR}/package.json`;
    fs.writeFileSync(packagePath, packageJson, "utf8");

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

const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--typescript": Boolean,
      "--javascript": Boolean,
      "--currDir": Boolean,
      "--currentDirectory": "--currDir",
      "-ts": "--typescript",
      "-js": "--javascript",
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
