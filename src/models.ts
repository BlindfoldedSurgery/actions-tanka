export enum TankaSubcommand {
    All = "all",
    Apply = "apply",
    None = "",
}

export enum GithubActionInputType {
    Number = "number",
    String = "string",
    StringArray = "stringArray",
    Time = "time",
    File = "file",
    Boolean = "boolean",
}

export type GithubActionInputEntryData = {
    value: string | string[] | boolean | number | undefined
    supported_subcommands: TankaSubcommand[],
    type: GithubActionInputType,
    priority?: number
    allowed_values?: string[],
};

export type GithubActionInputEntry = {
    name: string
    value: GithubActionInputEntryData
};
