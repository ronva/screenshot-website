import path from "path";
import captureWebsite from "capture-website";
import * as core from "@actions/core";
import artifact from "@actions/artifact";
import whichChrome from "./lib/which-chrome";

async function run() {
  try {
    // Get inputs: source, destination, and anything else
    const source = core.getInput("source");
    const destFile = core.getInput("destination");

    core.debug(`source is ${source}`);
    core.debug(`destination is ${destFile}`);

    // Get destination
    const destFolder = process.env.GITHUB_WORKSPACE;
    const dest = path.join(destFolder, destFile);

    // Locate Google Chrome executable
    const executablePath = await whichChrome();
    core.debug(`executablePath is ${executablePath}`);

    // Options for capture
    const options = {
      launchOptions: {
        executablePath,
      },
      ...inputs,
    };

    // Capture and write to dest
    await captureWebsite.file(source, dest, options);

    // Create an artifact
    const artifactClient = artifact.create();
    const artifactName = destFile.substr(0, destFile.lastIndexOf("."));
    const uploadResult = await artifactClient.uploadArtifact(
      artifactName,
      [dest],
      destFolder
    );

    // Expose the path to the screenshot as an output
    core.setOutput("path", dest);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
