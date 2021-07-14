const inquirer = require("inquirer");
const fs = require("fs");
const chalk = require("chalk");

const templates = require("./jsonTemplates.js");

const CURR_DIR = process.cwd();

console.log(chalk.cyan.bold("What would you like project to be called?"));
inquirer
  .prompt([
    {
      name: "projectName",
      type: "input",
      message: "Project name:",
      validate: (input) => fieldValidation(input),
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
          validate: (input) => fieldValidation(input),
        },
      ])
      .then((plugin) => {
        triggerProjectCreation(name.projectName, plugin.pluginName);
      });
  });

const triggerProjectCreation = (name, plugin) => {
  console.log("");
  console.log(chalk.green.bold("Creating your project..."));
  console.log("P.S. This might take a while");
  const projectName = name;
  const pluginName = plugin;
  const templatePath = `${__dirname}/figma-react-plugin-template`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  createDirectoryContents(templatePath, projectName);
  createJsonFiles(pluginName, projectName);
};

function createDirectoryContents(templatePath, newProjectPath) {
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
}

const createJsonFiles = (pluginName, projectName) => {
  //Generate manifest.json
  const manifestPath = `${CURR_DIR}/${projectName}/manifest.json`;
  const manifestJson = templates.getManifestJson(pluginName);
  fs.writeFileSync(manifestPath, manifestJson, "utf8");

  //Generate package.json
  const packagePath = `${CURR_DIR}/${projectName}/package.json`;
  const packageJson = templates.getPackageJson(projectName);
  fs.writeFileSync(packagePath, packageJson, "utf8");
};

const fieldValidation = (input) => {
  if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
  else
    return "Plugin name may only include letters, numbers, underscores and hashes.";
};
