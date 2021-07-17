# Create React Figma Plugin

A tool to get you started making Figma plugins with a React UI <sup>1</sup>.

_This tool is in currently in beta so please report any bugs or issues_ 🙏

## Get started

You'll need to setup both your development environment and add the plugin to Figma in order to get developing your plugin.

### Dev enironment

To create the project template, run the following command. It will create a new folder in the directory you're running the command from with the project template.

```sh
npx @mtmeyer/create-react-figma-plugin
```

or for Typescript run the following command:

```sh
npx @mtmeyer/create-react-figma-plugin --typescript
```

Follow the prompts in the CLI to generate the project. Then get the development server started.

```sh
cd project-name
npm run dev
```

The development server is now running and the plugin is ready to be added to Figma for development.

### Figma

Now we will add the plugin to Figma for development. Note that this will not publish the plugin and it will only be visible to you.

1. Open Figma
2. Click on your profile icon dropdown in the top right and select `Plugins` from the list
3. Scroll down to the `In development` section and click the plus(+) icon
4. In the `Link existing plugin` section, click the box to choose your `manifest.json` file
5. Locate the `manifest.json` in your newly created project and then select `Open`
6. Now you will be able to use this plugin within a design file 🎉

## Options

`@mtmeyer/create-react-figma-plugin` comes with the following options:

- --javascript, --js - Create project with vanilla JavaScript
- --typescript, --ts - Create project with TypeScript
- --currDir, --currentDirectory - Creates project in current directory rather than creating a new directory.

---

<sup>1</sup> Note: I am not affiliated with Figma, I just ❤️ the tool.
