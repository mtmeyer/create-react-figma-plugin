import arg from "arg";

// Define input arguments
export function parseArgumentsIntoOptions(rawArgs) {
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
}
