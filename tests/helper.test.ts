const fs = require('fs');
import { cleanupFiles, executeTanka, findInputConfig, getInputsByType, getPriority, handleFileInputs, inputsToTankaFlags, isHelpOutput, parseInputs, populateInputConfigValues, sortInputs } from "../src/helper";
import { PARSE_INPUTS_CONFIG, SORT_INPUTS_CONFIG, FLAGS_INPUTS_CONFIG } from "./fixtures";
import { GithubActionInputEntry, GithubActionInputType, TankaSubcommand } from "../src/models";
import { parse } from "path";

function setEnvVar(inputName: string, value: string) {
    const name = `INPUT_${inputName.toLocaleUpperCase()}`;
    process.env[name] = value;
}

function resetEnvironment() {
    for (const key in process.env) {
        if (key.startsWith("INPUT_")) {
            process.env[key] = "";
        }
    }
}

afterEach(resetEnvironment);

describe("testing helper#getPriority", () => {
    test("should return 0 when priority is undefined", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        input.value.priority = undefined;
        expect(getPriority(input)).toBe(0);
    });
    test("should return priority when priority is defined", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        input.value.priority = 1;
        expect(getPriority(input)).toBe(1);
    });
});

describe("testing helper#parseInputs", () => {
    test("input with type boolean and value `true` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "true");
        let inputs = populateInputConfigValues([input]);
        inputs = parseInputs(TankaSubcommand.All, inputs);

        expect(inputs[0].value.value).toBe(true);
    });
    test("input with type boolean and value `false` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "false");
        let inputs = populateInputConfigValues([input]);
        inputs = parseInputs(TankaSubcommand.All, inputs);

        expect(inputs[0].value.value).toBe(false);
    });
    test("input with type boolean and value `1` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[0];
        setEnvVar(input.name, "1");
        let inputs = populateInputConfigValues([input]);

        expect(() => parseInputs(TankaSubcommand.All, inputs)).toThrow();
    });
    test("input with type number and value `1` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "1");
        let inputs = populateInputConfigValues([input]);
        inputs = parseInputs(TankaSubcommand.All, inputs);

        expect(inputs[0].value.value).toBe(1);
    });
    test("input with type number and value `testString` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "testString");
        let inputs = populateInputConfigValues([input]);
        expect(() => parseInputs(TankaSubcommand.All, inputs)).toThrow();
    });
    test("input with type number and value `true` should throw an error", () => {
        let input = PARSE_INPUTS_CONFIG[1];
        setEnvVar(input.name, "true");
        let inputs = populateInputConfigValues([input]);
        expect(() => parseInputs(TankaSubcommand.All, inputs)).toThrow();
    });
    test("input with type string and value `testString` should return the correct result", () => {
        let input = PARSE_INPUTS_CONFIG[2];
        setEnvVar(input.name, "testString");
        let inputs = populateInputConfigValues(PARSE_INPUTS_CONFIG);
        inputs = parseInputs(TankaSubcommand.All, [input]);

        expect(inputs[0].value.value).toBe("testString");
    });
    test("check that allowed_values is working with color", () => {
        let input = <GithubActionInputEntry>findInputConfig("color", FLAGS_INPUTS_CONFIG);
        setEnvVar(input.name, "asd");
        let inputs = populateInputConfigValues(PARSE_INPUTS_CONFIG);
        input.value.value = "asd";
        expect(() => parseInputs(TankaSubcommand.Apply, inputs)).toThrow()
    });
    test("combine StringArray correctly when both multilines and comma seperatorsd are used", () => {
        setEnvVar("tla_str", "A=1\nB=2,C=3");
        let inputs = populateInputConfigValues(PARSE_INPUTS_CONFIG);
        let input = <GithubActionInputEntry>findInputConfig("tla_str", inputs);
        expect(parseInputs(TankaSubcommand.All, [input])[0].value.value).toStrictEqual(["A=1", "B=2", "C=3"]);
    });
});

describe("testing helper#sortInputs", () => {
    test("inputs should be sorted by priority", () => {
        let inputs = populateInputConfigValues(SORT_INPUTS_CONFIG);
        inputs = sortInputs(inputs);

        expect(inputs[0].value.priority).toBe(3);
        expect(inputs[1].value.priority).toBe(2);
        expect(inputs[2].value.priority).toBe(1);
    });
});

describe("testing helper#parseValueByType", () => {
    test("boolean input with value undefined should be false", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = undefined;
        expect(parseInputs(TankaSubcommand.All, [input])[0].value.value).toBe(false);
    });
    test("boolean input with value false should be false", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = false;
        expect(parseInputs(TankaSubcommand.All, [input])[0].value.value).toBe(false);
    });
    test("boolean input with value true should be true", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = true;
        expect(parseInputs(TankaSubcommand.All, [input])[0].value.value).toBe(true);
    });
    test("boolean input with value 1 should throw", () => {
        let input = <GithubActionInputEntry>findInputConfig("boolean", PARSE_INPUTS_CONFIG);
        input.value.value = 1;
        expect(() => parseInputs(TankaSubcommand.All, [input])[0].value.value).toThrow();
    });
    test("number input with value 1 should be 1", () => {
        let input = <GithubActionInputEntry>findInputConfig("number", PARSE_INPUTS_CONFIG);
        input.value.value = 1;
        expect(parseInputs(TankaSubcommand.All, [input])[0].value.value).toBe(1);
    });
    test("number input with value 'ads' should throw", () => {
        let input = <GithubActionInputEntry>findInputConfig("number", PARSE_INPUTS_CONFIG);
        input.value.value = "ads";
        expect(() => parseInputs(TankaSubcommand.All, [input])[0].value.value).toThrow();
    });
    test("number input with value 'true' should throw", () => {
        let input = <GithubActionInputEntry>findInputConfig("number", PARSE_INPUTS_CONFIG);
        input.value.value = true;
        expect(() => parseInputs(TankaSubcommand.All, [input])[0].value.value).toThrow();
    });
    test("string input with value 'true' should return 'true'", () => {
        let input = <GithubActionInputEntry>findInputConfig("string", PARSE_INPUTS_CONFIG);
        input.value.value = "true";
        expect(parseInputs(TankaSubcommand.All, [input])[0].value.value).toBe("true");
    });
});

describe("testing helper#isHelpOutput", () => {
    test("should be help output if no args are passed", () => {
        try {
            const stdout = executeTanka("");
            expect(false);
        } catch(err: any) {
            expect(isHelpOutput(err.stderr.toString())).toBe(true);
        }
    });
    test("should not be help output if an empty string is passed", () => {
        expect(isHelpOutput("")).toBe(false);
    });
});

describe("testing helper#getInputsByType", () => {
    test("should return only boolean", () => {
        expect(getInputsByType(GithubActionInputType.Boolean, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.Boolean);
    });
    test("should return only number", () => {
        expect(getInputsByType(GithubActionInputType.Number, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.Number);
    });
    test("should return only string", () => {
        expect(getInputsByType(GithubActionInputType.String, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.String);
    });
    test("should return only file", () => {
        expect(getInputsByType(GithubActionInputType.File, PARSE_INPUTS_CONFIG)[0].value.type).toBe(GithubActionInputType.File);
    });
});

describe("testing helper#inputsForTankaFlags", () => {
    test("check that environment is treated as value only", () => {
        let input = <GithubActionInputEntry>findInputConfig("environment", FLAGS_INPUTS_CONFIG);
        let input_deps = <GithubActionInputEntry>findInputConfig("environments_path", FLAGS_INPUTS_CONFIG);
        input.value.value = "test";
        expect(inputsToTankaFlags([input, input_deps])[0]).toBe("environments/test")
    });
    test("check that truthy boolean is converted to a flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("force", FLAGS_INPUTS_CONFIG);
        input.value.value = true;
        expect(inputsToTankaFlags([input])[0]).toBe("--force")
    });
    test("check that falsy boolean is not converted to a flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("force", FLAGS_INPUTS_CONFIG);
        input.value.value = false;
        expect(inputsToTankaFlags([input])).toStrictEqual([])
    });
    test("check that number is passed to the flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("max-stack", FLAGS_INPUTS_CONFIG);
        input.value.value = 60;
        expect(inputsToTankaFlags([input])[0]).toBe("--max-stack=60")
    });
    test("check that string is passed to the flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("color", FLAGS_INPUTS_CONFIG);
        input.value.value = "always";
        expect(inputsToTankaFlags([input])[0]).toBe("--color=always")
    });
    test("check that string is passed to the flag", () => {
        let input = <GithubActionInputEntry>findInputConfig("kubeconfig", FLAGS_INPUTS_CONFIG);
        input.value.value = "/tmp/asd";
        expect(inputsToTankaFlags([input])[0]).toBe("--kubeconfig=/tmp/asd")
    });
});

describe("testing helper#handleFileInputs", () => {
    test("existing file should be treated as a file", () => {
        const path = "testHandleFileInputs";
        fs.writeFileSync(path, "");
        let input = <GithubActionInputEntry>findInputConfig("kubeconfig", FLAGS_INPUTS_CONFIG);
        input.value.value = path;

        input = handleFileInputs([input])[0];
        expect(input.value.value).toBe(path);
        fs.unlinkSync(path);
    });
    test("existing file should be treated as a file", () => {
        let input = <GithubActionInputEntry>findInputConfig("kubeconfig", FLAGS_INPUTS_CONFIG);
        input.value.value = "test123asd";

        input = handleFileInputs([input])[0];
        const content = fs.readFileSync(input.value.value).toString();
        expect(content).toBe("test123asd");
        cleanupFiles([input]);
    });
});
