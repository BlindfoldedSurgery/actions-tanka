import { TankaSubcommand, GithubActionInputType, GithubActionInputEntry } from "../src/models";
import { GITHUB_ACTIONS_INPUT_CONFIGURATION } from "../src/input_definitions";


export const PARSE_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: 'boolean',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.Boolean,
        },
    }, {
        name: 'number',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.Number,
        },
    }, {
        name: 'string',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
        },
    }, {
        name: 'time',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.Time,
        },
    }, {
        name: 'file',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
        },
    }, {
        name: 'tla_str',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.StringArray,
        },
    }, {
        name: 'environments_path',
        value: {
            value: "environments",
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
        },
    }, {
        name: 'color',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
            allowed_values: ["never", "always", "auto"]
        },
    },
]

export const VALIDATE_NAME_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: 'environment',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
        },
    }, {
        name: 'environments_path',
        value: {
            value: "environments",
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
]

export const SORT_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: '2',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.Boolean,
            priority: 2,
        },
    }, {
        name: '1',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
            priority: 1,
        },
    }, {
        name: '3',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
            priority: 3,
        },
    }, {
        name: 'environments_path',
        value: {
            value: "environments",
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
];

export const FLAGS_INPUTS_CONFIG: GithubActionInputEntry[] = [
    {
        name: 'environment',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
            priority: 3,
        },
    }, {
        name: 'kubeconfig',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
            priority: 3,
        },
    }, {
        name: 'environments_path',
        value: {
            value: "environments",
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
        },
    }, {
        name: 'force',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.Boolean,
        },
    }, {
        name: 'max-stack',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.Number,
        },
    }, {
        name: 'color',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.String,
            allowed_values: ["never", "always", "auto"]
        },
    },
];
