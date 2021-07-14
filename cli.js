const inquirer = require("inquirer");
const { exec } = require("child_process");
const fs = require("fs");
const arg = require("arg");
const chalk = require("chalk");
const ora = require("ora");

const templates = require("./jsonTemplates.js");

const TEMPLATE_NAMES = {
  javascript: "figma-react-plugin-template-js",
  typescript: "figma-react-plugin-template-ts",
};

export const createProjectTemplate = (args) => {
  let options = parseArgumentsIntoOptions(args);
  const CURR_DIR = process.cwd();

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

    fs.mkdirSync(`${CURR_DIR}/${projectName}`);

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

        const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, "utf8");
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

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
    const manifestPath = `${CURR_DIR}/${projectName}/manifest.json`;
    const manifestJson = templates.getManifestJson(pluginName);
    fs.writeFileSync(manifestPath, manifestJson, "utf8");

    //Generate package.json
    let packageJson;
    if (template.toLowerCase() == "javascript") {
      packageJson = templates.getPackageJson(projectName, false);
    } else if (template.toLowerCase() == "typescript") {
      packageJson = templates.getPackageJson(projectName, true);
    }
    const packagePath = `${CURR_DIR}/${projectName}/package.json`;
    fs.writeFileSync(packagePath, packageJson, "utf8");

    //Initialise loading spinner
    console.log("");
    const spinner = ora("Installing packages").start();
    spinner.color = "blue";
    spinner.text = "Installing packages";

    //Run npm install
    let installCommand = exec(
      `cd ${projectName} && npm install`,
      function (err, stdout, stderr) {
        spinner.stop();
        console.log("");
        console.log("---------------------");
        console.log("");

        console.log(chalk.green.bold("Project successfully created"));
        console.log(
          chalk`Run '{magenta.bold cd ${projectName} && npm run dev}' to run the development server.`
        );
        console.log("");
        console.log(
          chalk`Read the {bold Readme} for instructions on how to add your plugin to Figma for development`
        );

        console.log("");
        console.log("---------------------");
        if (err) throw err;
      }
    );
  };
};

const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--typescript": Boolean,
      "--javascript": Boolean,
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
  };
};
