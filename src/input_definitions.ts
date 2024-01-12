import { GithubActionInputEntry, GithubActionInputType, TankaSubcommand } from "./models";


export const GITHUB_ACTIONS_INPUT_CONFIGURATION: GithubActionInputEntry[] = [
    {
        name: 'kubeconfig',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.All],
            type: GithubActionInputType.File,
        },
    },
    {
        name: 'environment',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'environments_path',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'apply_strategy',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'auto_approve',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
            allowed_values: ["always", "never", "if-no-changes"],
        },
    },
    {
        name: 'color',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
            allowed_values: ["auto", "always", "never"],
        },
    },
    {
        name: 'diff_strategy',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'dry_run',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
            allowed_values: ["none", "server", "client"],
        },
    },
    {
        name: 'ext_code',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.StringArray,
        },
    },
    {
        name: 'ext_str',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.StringArray,
        },
    },
    {
        name: 'force',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.Boolean,
        },
    },
    {
        name: 'log_level',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
            allowed_values: ["disabled", "fatal", "error", "warn", "info", "debug", "trace"],
        },
    },
    {
        name: 'max_stack',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.Number,
        },
    },
    {
        name: 'name',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'target',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.String,
        },
    },
    {
        name: 'tla_code',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.StringArray,
        },
    },
    {
        name: 'tla_str',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.StringArray,
        },
    },
    {
        name: 'validate',
        value: {
            value: undefined,
            supported_subcommands: [TankaSubcommand.Apply],
            type: GithubActionInputType.Boolean,
        },
    },
]