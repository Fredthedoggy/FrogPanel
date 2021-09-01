# FrogPanel
FrogPanel is a set of Pterodactyl Modifications by [Fredthedoggy](https://github.com/Fredthedoggy).

All Modifications are Made on Separate [Branches](https://github.com/Fredthedoggy/frogpanel/branches) of the Repository, and Distributed as git patch files.

## Installing

### Automatic
To install patches automatically, run the following command & follow the prompts
```shell
curl https://raw.githubusercontent.com/Fredthedoggy/frogpanel/installation/install.sh -o /tmp/addons.sh >/dev/null 2>&1 && sh /tmp/addons.sh && rm /tmp/addons.sh
```

### Manual
To install a given patch run the following script in your terminal, replacing `{patch}` with the specified patch's name
```shell
curl https://raw.githubusercontent.com/Fredthedoggy/frogpanel/installation/Patches/{patch}.patch | git apply -v
```
Then, rebuild panel assets as shown [here](https://pterodactyl.io/community/customization/panel.html)

## Available Modifications

### Files In Editor
 - **Name**: `Files-In-Editor`
 - **Supported Pterodactyl Version(s)**: `1.5.1`
 - **Github Branch**: [`fredthedoggy/view-files-in-editor`](https://github.com/Fredthedoggy/frogpanel/tree/fredthedoggy/view-files-in-editor)

This modification shows all files in the current directory next to the file editing tab, for ease-of-use when editing multiple files at once.
![Files-In-Editor Screenshot](https://fredthedoggy.nothing-to-see-he.re/58NjuSMIW.png "Files-In-Editor")
