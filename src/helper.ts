const fs = require('fs');
const core = require('@actions/core');
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "./input_definitions";
import { GithubActionInputEntry, GithubActionInputType, TankaSubcommand } from "./models";
import { writeTmpfile, deleteTmpfile } from "./tmpfile";
import { execSync } from 'child_process';

export function findInputConfig(name: string, inputs: GithubActionInputEntry[]): GithubActionInputEntry | undefined {
    return inputs.find((entry: GithubActionInputEntry) => {
        return entry.name === name;
    });
}

export function getPriority(input: GithubActionInputEntry): number {
    if (input.value.priority === undefined) {
        return 0;
    } else {
        return input.value.priority;
    }
}

export function validateAllowedValues(input: GithubActionInputEntry): boolean {
    if (input.value.allowed_values === undefined || input.value.allowed_values.length == 0) {
        return true;
    }

    return input.value.allowed_values!.includes((<string>input.value.value));
}

export function sortInputs(inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.sort((item1, item2) => getPriority(item2) - getPriority(item1));
}

export function populateInputConfigValues(config: GithubActionInputEntry[] = GITHUB_ACTIONS_INPUT_CONFIGURATION): GithubActionInputEntry[] {
    return config.map((input: GithubActionInputEntry) => {
        if (input.value.type === GithubActionInputType.StringArray) {
            input.value.value = core.getMultilineInput(input.name);
        } else {
            input.value.value = core.getInput(input.name);
        }

        return input;
    })
}

export function parseInputs(subcommand: TankaSubcommand, config: GithubActionInputEntry[] = GITHUB_ACTIONS_INPUT_CONFIGURATION): GithubActionInputEntry[] {
    const result = config.map((input: GithubActionInputEntry) => {
        input.value.value = parseValueByType(input);
        validateInput(input, subcommand);
        return input;
    });

    return handleFileInputs(result);
}

export function validateInput(input: GithubActionInputEntry, subcommand: TankaSubcommand): boolean {
    if (subcommand === TankaSubcommand.None && input.value.type !== GithubActionInputType.File) {
        return true;
    }
    const isSupportedSubcommand = input.value.supported_subcommands.includes(subcommand) || input.value.supported_subcommands.includes(TankaSubcommand.All);
    const hasValue = input.value.value !== "" && input.value.value !== undefined;
    const isFalseBoolean = input.value.type === GithubActionInputType.Boolean && input.value.value === false;

    if (!isSupportedSubcommand && hasValue && !isFalseBoolean) {
        // boolean is set to false by default and will not be passed as a flag
        throw Error(`${input.name} is not supported for ${subcommand}`);
    }

    if (input.value.type === GithubActionInputType.Boolean) {
        if (!(input.value.value === true || input.value.value === false)) {
            throw Error(`'${input.name}' with type 'Boolean' must be 'true' or 'false'`)
        }
    } else if (input.value.type === GithubActionInputType.Number) {
        if (Number.isNaN(<Number>input.value.value)) {
            throw Error(`'${input.name}' with type 'Number' must not be 'NaN'`)
        }
    }

    if (!validateAllowedValues(input)) {
        throw Error(`${input.value.value} is not a valid value for ${input.name}`)
    }

    return isSupportedSubcommand || subcommand === TankaSubcommand.None;
}

export function parseValueByType(input: GithubActionInputEntry): string | string[] | boolean | number | undefined {
    const value = input.value.value;
    // requirement validation will be done in `validateInput`
    if (value === "" || value === undefined) {
        if (input.value.type === GithubActionInputType.Boolean) {
            return false;
        }

        return input.value.value;
    }

    switch (input.value.type) {
        case GithubActionInputType.Boolean:
            if (input.value.value === false || input.value.value === true) {
                return input.value.value;
            }

            const val = <string>value;
            switch (val.toLowerCase()) {
                case "true":
                    return true;
                case "false":
                    return false;
                default:
                    return undefined;
            }
        case GithubActionInputType.Number:
            const strval = String(value).toLowerCase();
            if (strval === "true" || strval === "false") {
                throw Error("boolean value won't be auto-converted to a number, use `0`/`1` respectively");
            }
            return Number(value);
        case GithubActionInputType.File:
            return value;
        case GithubActionInputType.Time:
            return value;
        case GithubActionInputType.String:
            return value;
        case GithubActionInputType.StringArray:
            var v: string[] = (<string[]>input.value.value);
            // why do I even bother with typing..
            if (typeof(v) === "string") {
                v = [v];
            }
            let res: string[] = v.flatMap((l) => l.split(",").map((s) => s.trim()));
            return res;
    }
}

export function handleFileInputs(inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.map((entry: GithubActionInputEntry) => {
        if (entry.value.type !== GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }

        if (fs.existsSync(<string>entry.value.value)) {
            console.info(`handle value from '${entry.name}' as filepath`)
            return entry;
        } else {
            if ((<string>entry.value.value).length === 0) {
                throw Error(`value for ${entry.name} is empty (content for file arguments should not be empty, omit file argument instead)`);
            }

            console.info(`handle value from ${entry.name} as file content (generating temporary file)`)
            const path = writeTmpfile(<string>entry.value.value);
            entry.value.value = path;
            return entry;
        }
    })
}

export function cleanupFiles(inputs: GithubActionInputEntry[]) {
    return inputs.forEach((entry: GithubActionInputEntry) => {
        if (entry.value.type !== GithubActionInputType.File || entry.value.value === "") {
            return entry;
        }

        const value = <string>entry.value.value;
        if (value !== undefined) {
            deleteTmpfile(value);
        }
    })
}

export function inputsToTankaFlags(inputs: GithubActionInputEntry[]): string[] {
    return <string[]>inputs.map((input: GithubActionInputEntry) => {
        const flag = `--${input.name.replace(/_/g, "-")}`

        if (input.value.value === undefined) {
            throw Error(`value for ${input.name} is not set`)
        }
        else if (input.name === "environment") {
            let environments_path_input = findInputConfig("environments_path", inputs);
            if (environments_path_input === undefined) {
                throw Error("please open a bug in BlindfoldedSurgery/actions-tanka")
            }

            let environments_path = <string>environments_path_input?.value.value
            let path = environments_path.concat('/', <string>input.value.value);
            return path.replace(/\/+/, '/');
        } else if (input.name === "environments_path") {
            return undefined;
        }
        else if (input.value.type === GithubActionInputType.Boolean) {
            if (input.value.value) {
                return flag;
            }
        } else if (input.value.type === GithubActionInputType.StringArray) {
            let value = <string[]>input.value.value;
            if (value.length === 0) {
                return undefined;
            }

            return value.map((value) => `${flag}="${value}"`).join(" ")
        } else if (input.value.value !== "") {
            const value = input.value.value;

            return `${flag}=${value}`
        } else {
            return undefined;
        }
    }).filter((item) => item);
}

export function getInputEntry(name: string, inputs: GithubActionInputEntry[]): GithubActionInputEntry {
    return <GithubActionInputEntry>inputs.find((item) => item.name === name);
}

export function getValueForName(name: string, inputs: GithubActionInputEntry[]): string | string[] | number | boolean | undefined {
    const item = getInputEntry(name, inputs);

    return item.value.value;
}

export function getInputsByType(type: GithubActionInputType, inputs: GithubActionInputEntry[]): GithubActionInputEntry[] {
    return inputs.filter((item: GithubActionInputEntry) => item.value.type === type)
}

export function executeTanka(args: string): string {
    args = args.replace(/^tk /, "")
    const command = `tk ${args}`;
    console.log(`executing ${command}`)
    const stdout = execSync(command).toString();
    console.log(stdout);

    return stdout;
}

export function isHelpOutput(stdout: string): boolean {
    let matches = stdout.match(/Usage:/);

    if (matches === null) {
        return false;
    } else {
        return matches.length != 0;
    }
}
