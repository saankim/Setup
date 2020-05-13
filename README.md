# OSX setup

*tested on MPB 16 macOS Catalina Version 10.15.4*

**!!!need to fix errors on the fly!!!**

![Screenshot](./mac.png)

## Initial setting
```
git clone https://github.com/ji-1/mac-setup
./init.sh
```

## Install yabai, skhd
need to install yabai, skhd manually

yabai: https://github.com/koekeishiya/yabai/wiki/Installing-yabai-(latest-release)

skhd: https://github.com/koekeishiya/skhd

### Install config file
```
mv mac-setup/skhdrc ~/.skhdrc
mv mac-setup/yabairc ~/.yabairc
```
### Apply Change
```
brew services restart skhd
brew services restart yabai
```
shortcut: `ctrl + alt + cmd - r`
