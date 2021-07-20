import { parseArgumentsIntoOptions } from "./index";

let defaultArgs = process.argv;

describe("Parse default arguments into options", () => {
  it("Should output object where every property is false when no arguments passed in", () => {
    const output = parseArgumentsIntoOptions(defaultArgs);
    expect(output).toEqual({
      typescript: false,
      javascript: false,
      currentDirectory: false,
    });
  });
});
describe("Parse typescript arguments into options", () => {
  it("Should output object where typescript is true when passed --typescript argument", () => {
    const args = [...defaultArgs, "--typescript"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: true,
      javascript: false,
      currentDirectory: false,
    });
  });
  it("Should output object where typescript is true when passed --ts argument", () => {
    const args = [...defaultArgs, "--ts"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: true,
      javascript: false,
      currentDirectory: false,
    });
  });
});
describe("Parse javascript arguments into options", () => {
  it("Should output object where javascript is true when passed --javascript argument", () => {
    const args = [...defaultArgs, "--javascript"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: false,
      javascript: true,
      currentDirectory: false,
    });
  });
  it("Should output object where javascript is true when passed --js argument", () => {
    const args = [...defaultArgs, "--js"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: false,
      javascript: true,
      currentDirectory: false,
    });
  });
});
describe("Parse currDir arguments into options", () => {
  it("Should output object where currentDirectory is true when passed --currDir argument", () => {
    const args = [...defaultArgs, "--currDir"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: false,
      javascript: false,
      currentDirectory: true,
    });
  });
  it("Should output object where currentDirectory is true when passed --currentDirectory argument", () => {
    const args = [...defaultArgs, "--currentDirectory"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: false,
      javascript: false,
      currentDirectory: true,
    });
  });
});
describe("Parse multiple arguments into options", () => {
  it("Should output object where currentDirectory and typescript are true when passed --currDir --ts argument", () => {
    const args = [...defaultArgs, "--currDir", "--ts"];
    const output = parseArgumentsIntoOptions(args);
    expect(output).toEqual({
      typescript: true,
      javascript: false,
      currentDirectory: true,
    });
  });
});
//TODO add test where javascript and typescript are passed in and it doesn't allow it
