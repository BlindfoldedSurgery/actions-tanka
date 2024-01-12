const fs = require('fs');
const core = require('@actions/core');
import { getInputsByType, parseInputs, inputsToTankaFlags, executeTanka, cleanupFiles, sortInputs, populateInputConfigValues, isHelpOutput } from "./helper";
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "./input_definitions";
import { GithubActionInputEntry, GithubActionInputType, TankaSubcommand } from "./models";

let inputs: GithubActionInputEntry[] = GITHUB_ACTIONS_INPUT_CONFIGURATION;
try {
    const rawSubcommand: string = core.getInput("subcommand");
    const subcommand = rawSubcommand as TankaSubcommand;
    const rawCommand = core.getInput("raw_command");

    if (subcommand === TankaSubcommand.None && rawCommand === "") {
        throw Error("either `subcommand` or `raw_command` has to be set");
    }

    populateInputConfigValues();
    let command = `${rawSubcommand}`;
    if (rawCommand !== "") {
        inputs = getInputsByType(GithubActionInputType.File, inputs);

        command = `${rawCommand}`
    }
    inputs = sortInputs(parseInputs(subcommand, inputs));
    const flags = inputsToTankaFlags(inputs).join(" ");

    const stdout = executeTanka(`${command} ${flags}`);
    if (isHelpOutput(stdout)) {
        throw Error(`failing due to detected tanka help output`);
    }

} catch (error: any) {
    core.setFailed(error.message);
}

cleanupFiles(inputs);
