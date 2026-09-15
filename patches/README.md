# patches/

Patch files for third-party npm packages, applied by `patch-package` on `postinstall`.

To create one:

```sh
# edit the file under node_modules/<pkg>/... then:
npx patch-package <pkg>
```

Each patch must have a comment at the top of the diff (or a note here) saying **why** it exists and the upstream issue/PR link, so it can be removed when upstream ships the fix.

| Package | Reason | Upstream |
| --- | --- | --- |
| _(none yet)_ | | |
