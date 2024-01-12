# actions-tanka

This action simplifies interaction with the tanka (tk) command in a github action.

Any input which tanka interacts with as a file (e.g. `kubeconfig`) will be written into a temporary file, this action will validate that the file is not empty. If the value is an existing path that file will be used.

## Example

(!) Make sure that all requirements are met

```yaml
deploy:
  name: "Publish to k8s"
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      # make sure that tanka is installed before doing this
      uses: BlindfoldedSurgery/actions-tanka # TODO
      with:
        subcommand: apply
        environment: default
        auto_approve: always
        tla_str: |
          MY_COOL_SECRET=${{ secrets.WOHOO_I_AM_A_SECRET }}
          ANOTHER_SECRET=${{ secrets.THIS_JUST_SEEMS_EXCESSIVE }},HEY_THERE=${{ secrets.WHY_AM_I_SUPPORTING_THIS }}
        ext_str: THIS_SEEMS_NORMAL=${{ secrets.OR_DOES_IT }}
        ext_code: YES=${{ secrets.NO }},MAYBE=look_at_me_i'm_tiny
        kubeconfig: ${{ secrets.KUBECONFIG_RAW }}
```

This results in the following output:

```bash
# TODO
```

## Requirements

This action assumes that tanka is already installed in the github action.

This can be done via e.g. asdf:

```
# .tool-versions
tanka 0.26.0
jb 0.5.1
jsonnet 0.20.0
```

You can then add the following before calling this action:

`uses: asdf-vm/actions/install@v3`

## Support

> Note: There is a `raw_command` input which you can pass any subcommand/flags to, it will simply append the input to the tanka binary (`tanka {raw_command}`)

> Note: There is no interal list for supported commands, this list is simply commands which have the flags implemented and have been tested, it's likely better to use `raw_command` if you want to use a subcommand which isn't checked in this list.

currently the following subcommands are supported/tested:

- [x] apply
- [ ] show
- [ ] diff
- [ ] prune
- [ ] delete
- [ ] env
- [ ] status
- [ ] export
- [ ] fmt
- [ ] lint
- [ ] eval
- [ ] tool
- [ ] complete

### Unsupported actions

Some flags/subcommands aren't/won't be supported due to them not making sense in a CI/CD environment


#### subcommands

- init

#### flags

- help
