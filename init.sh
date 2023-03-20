#!/bin/bash

echo "### init.sh started"

# homebrew
echo "### Installing brew"
if [[ ! $(which brew) ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
brew update
brew update --cask

# brew package
echo "### Installing brew packages..."
# package list
PACKAGES=(
  gh
  git
  htop
  pandoc
  python3
  pip
  jq
  tree
  wget
  zsh
  rdkit
)
brew install ${PACKAGES[@]}

# brew apps
echo "### Installing brew cask applications..."
# applicaion list
APPLICATIONS=(
  aldente
  discord
  dropbox
  flotato
  flux
  google-chrome
  grammarly
  grammarly-desktop
  hiddenbar
  iina
  inkscape
  karabiner-elements
  keka
  keyboardcleantool
  mactex
  mathpix-snipping-tool
  monitorcontrol
  obsidian
  raycast
  table-tool
  visual-studio-code
  zoom
)
brew install --cask ${APPLICATIONS[@]}

# OS X
echo "### Configuring OS X..."
## Show filename extensions by default
defaults write NSGlobalDomain AppleShowAllExtensions -bool true
## Enable tap-to-click
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
defaults -currentHost write NSGlobalDomain com.apple.mouse.tapBehavior -int 1
## Make dock faster
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0
## Make launchpad faster
defaults write com.apple.dock springboard-show-duration -int 0
defaults write com.apple.dock springboard-hide-duration -int 0
## Make Mission Control faster
defaults write com.apple.dock expose-animation-duration -float 0
## Make Save Dialog faster
defaults write -g NSWindowResizeTime -float 0.01
## Make popup faster
defaults write -g NSAutomaticWindowAnimationsEnabled -bool FALSE
## See all files
defaults write com.apple.Finder AppleShowAllFiles YES
## blank dock 
defaults write com.apple.dock persistent-apps -array-add '{tile-data={}; tile-type="spacer-tile";}';killall Dock

# oh-my-zsh
echo "### Installing oh-my-zsh..."
export ZSH="~/.config/oh-my-zsh"
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# configs
echo "### Setting configs..."
cp -r ~/mac-setup/config ~/.config

# zsh
echo "### Setting oh-my-zsh..."
## zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.config/oh-my-zsh/custom/plugins/zsh-autosuggestions
## zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.config/oh-my-zsh/custom/plugins/zsh-syntax-highlighting
## zsh-navigation-tools
git clone https://github.com/psprint/zsh-navigation-tools.git ~/.config/oh-my-zsh/custom/plugins/zsh-navigation-tools
alias-tips

# zshrc
echo "### Setting zsh..."
cp ~/mac-setup/.zshrc ~/.zshrc
source ~/.zshrc

# z.sh
echo "### Installing z.sh..."
git clone https://github.com/rupa/z.git ~/.config/z/

# tidy brew
echo "### Tidy brew..."
brew update
brew upgrade
brew upgrade --cask
brew cleanup
brew autoremove
omz update

# pip
echo "### Pip install..."
python3.10 -m pip install --upgrade pip
# pip list
PIPS=(
  numpy
  pandas
  matplotlib
  seaborn
  scikit-learn
  jupyter
  scipy
  tensorflow
  keras
  opencv-python
  torch
  torchvision
  torchtext
  transformers
  networkx
  rdkit
  jax
  plotly
)
pip3.10 install --upgrade ${PIPS[@]}

# done
echo "### init.sh done"