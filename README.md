# Create React Figma Plugin

A tool to get you started making Figma plugins with a React UI.

## Get started

You'll need to setup both your development environment and add the plugin to Figma in order to get developing your plugin.

### Dev enironment

Install the repository with npm.

```sh
npm i create-react-figma-plugin
```

Run the following command to create the project template

```sh
create-react-figma-plugin
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
