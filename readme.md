# FrogPanel
FrogPanel is a set of Pterodactyl Modifications by [Fredthedoggy](https://github.com/Fredthedoggy).

All Modifications are Made on Separate [Branches](https://github.com/Fredthedoggy/frogpanel/branches) of the Repository, and Distributed as git patch files.

## Installing (Addons, Not Themes! See [here](#themes) for themes)

### Automatic
To install patches automatically, run the following command & follow the prompts
```shell
curl https://raw.githubusercontent.com/Fredthedoggy/frogpanel/installation/install.sh -o /tmp/addons.sh >/dev/null 2>&1 && sh /tmp/addons.sh && rm /tmp/addons.sh
```

### Semi - Automatic
To install a given patch run the following script in your terminal, replacing `{patch}` with the specified patch's name
```shell
curl https://raw.githubusercontent.com/Fredthedoggy/frogpanel/installation/Patches/{patch}.patch | git apply -v
```
Then, rebuild panel assets as shown [here](https://pterodactyl.io/community/customization/panel.html)

### Git Instalation
If your panel is kept up to date via git (As I Would Recommend), then add the appropriate branch as an upstream to your repo, and merge accordingly.
See [below](#available-modifications) for branches.

### Manual

> :warning: Currently Broken. Please use one of the above for now

To install a patch manually, visit [github.com/Fredthedoggy/frogpanel/tree/installation/Readable](https://github.com/Fredthedoggy/frogpanel/tree/installation/Readable), and select a patch to apply.
Follow the instructions in the `.txt` file, copy/pasting things into the correct locations.

> :warning: If you have made previous edits to these files, the line numbers *will* be off. Pleae consult the official pterodactyl branch for your release, and compare the file to yours, adjusting line numbers appropriately.

Then, rebuild panel assets as shown [here](https://pterodactyl.io/community/customization/panel.html)

## Available Modifications (Addons, Not Themes! See [here](#themes) for themes)

### Files In Editor
 - **Name**: `Files-In-Editor`
 - **Supported Pterodactyl Version(s)**: `1.6`
 - **Github Branch**: [`fredthedoggy/view-files-in-editor`](https://github.com/Fredthedoggy/frogpanel/tree/fredthedoggy/view-files-in-editor)

This modification shows all files in the current directory next to the file editing tab, for ease-of-use when editing multiple files at once.
![Files-In-Editor Screenshot](https://fredthedoggy.nothing-to-see-he.re/58NjuSMIW.png "Files-In-Editor")

### Bigger Console
- **Name**: `Bigger-Console`
- **Supported Pterodactyl Version(s)**: `1.6`
- **Github Branch**: [`fredthedoggy/bigger-console`](https://github.com/Fredthedoggy/frogpanel/tree/fredthedoggy/bigger-console)

This modification makes the console GUI taller, by moving the resource graphs to the side, instead of below the console.
![Bigger-Console Screenshot](https://fredthedoggy.nothing-to-see-he.re/593ltu4R8.png "Bigger-Console")

## Themes
There are also some pre-combined themes with multiple addons and or custom features, which use a different install proccess:
> Start by creating a new directory to clone into.
> Run `git clone -b {branch} https://github.com/Fredthedoggy/FrogPanel.git`, replacing `{branch}` with the theme's branch. (eg. `fredthedoggy/zing-theme`)
> Copy all files in the newly cloned directory into your pterodactyl install (eg. `/var/www/pterodactyl`)
> Then, rebuild panel assets as shown [here](https://pterodactyl.io/community/customization/panel.html)

### Zing Theme
- **Supported Pterodactyl Version(s)**: `1.6.2`
- **Github Branch**: [`fredthedoggy/zing-theme`](https://github.com/Fredthedoggy/frogpanel/tree/fredthedoggy/zing-theme)

This theme adds the `Files-In-Editor`, and `Bigger-Console` Addons, as well as a fancy sidebar, and a new color scheme!
![Zing Theme Screenshot](https://fredthedoggy.nothing-to-see-he.re/59jXfKib4.png "Zing Theme")
![Zing Theme Screenshot Mobile](https://fredthedoggy.nothing-to-see-he.re/59jXnJEpQ.gif "Zing Theme Mobile")

## Contributing

### Custom Modifications
To add another modification, please create a fork of FrogPanel, and create a new branch for your mod, from Pterodactyl Official's last release branch.
Make your modifications, and then export it to a patch file. Place the patch file in `/Patches`, and rebuild Readable patches (as shown below), and make a PR!

### Rebuilding Readable Patches.
FrogPanel uses a custom `.patch` -> readable `.txt` file converter. To run it, start by installing NodeJS and yarn (as shown in the Pterodactyl installation page), then run `yarn` in this  root directory. From there, run `yarn run createReadable` to rebuild / build Readables.
