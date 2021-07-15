exports.getManifestJson = (pluginName) => {
  const manifestObject = {
    name: pluginName,
    id: "00000000",
    api: "1.0.0",
    main: "dist/code.js",
    ui: "dist/ui.html",
  };

  return JSON.stringify(manifestObject, null, 2);
};

// TODO work out better way to generate package.json
exports.getPackageJson = (projectName, typescript) => {
  let packageObject;
  if (typescript) {
    packageObject = {
      name: projectName,
      version: "1.0.0",
      description:
        "A template for creating Figma plugins with React for the UI element.  It supports Typescript and CSS/SCSS modules out of the box",
      license: "ISC",
      scripts: {
        build: "webpack --mode=production",
        dev: "webpack --mode=development --watch",
        "prettier:format":
          "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,json}' ",
      },
      dependencies: {
        react: "^17.0.2",
        "react-dom": "^17.0.2",
      },
      devDependencies: {
        "@figma/plugin-typings": "^1.24.0",
        "@types/react": "^17.0.11",
        "@types/react-dom": "^17.0.7",
        "css-loader": "^5.0.1",
        "html-webpack-inline-source-plugin": "^0.0.10",
        "html-webpack-plugin": "^3.2.0",
        husky: "^4.3.0",
        "lint-staged": "^10.5.1",
        prettier: "^2.3.1",
        sass: "^1.35.2",
        "sass-loader": "^10.1.1",
        "style-loader": "^2.0.0",
        "ts-loader": "^8.0.11",
        typescript: "^4.3.5",
        "url-loader": "^4.1.1",
        webpack: "^4.46.0",
        "webpack-cli": "^3.3.12",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
      "lint-staged": {
        "src/**/*.{js,jsx,ts,tsx,css,json}": ["prettier --write", "git add"],
      },
    };
  } else {
    packageObject = {
      name: projectName,
      version: "1.0.0",
      description:
        "A template for creating Figma plugins with React for the UI element.  It supports Typescript and CSS/SCSS modules out of the box",
      license: "ISC",
      scripts: {
        build: "webpack --mode=production",
        dev: "webpack --mode=development --watch",
        "prettier:format":
          "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,json}' ",
      },
      dependencies: {
        react: "^17.0.2",
        "react-dom": "^17.0.2",
      },
      devDependencies: {
        "@babel/preset-react": "^7.14.5",
        "babel-loader": "^8.2.2",
        "css-loader": "^5.0.1",
        "html-webpack-inline-source-plugin": "^0.0.10",
        "html-webpack-plugin": "^3.2.0",
        husky: "^4.3.0",
        "lint-staged": "^10.5.1",
        prettier: "^2.3.1",
        sass: "^1.35.2",
        "sass-loader": "^10.1.1",
        "style-loader": "^2.0.0",
        "url-loader": "^4.1.1",
        webpack: "^4.46.0",
        "webpack-cli": "^3.3.12",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
      "lint-staged": {
        "src/**/*.{js,jsx,ts,tsx,css,json}": ["prettier --write", "git add"],
      },
    };
  }

  return JSON.stringify(packageObject, null, 2);
};
