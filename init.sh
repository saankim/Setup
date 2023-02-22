#!/bin/bash

echo "### init.sh started"

# configs
echo "### Setting configs..."
cp ./config ~/.config

# homebrew
echo "### Installing brew"
if [[ ! $(which brew) ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
brew update
brew --cask update

# brew package
echo "### Installing brew packages..."
# package list
PACKAGES=(
  gh
  git
  htop
  pandoc
  python@3.10
  python@3.11
  jq
  tree
  wget
  zsh
)
brew install ${PACKAGES[@]}

# brew apps
echo "### Installing brew cask applications..."
# applicaion list
APPLICATIONS=(
  discord
  dropbox
  flotato
  flux
  google-chrome
  grammarly
  grammarly-desktop
  iina
  inkscape
  karabiner-elements
  keka
  keyboardcleantool
  mactex
  mathpix-snipping-tool
  monitorcontrol
  obsidian
  papers
  raycast
  table-tool
  visual-studio-code
  zoom
)
brew --cask install ${APPLICATIONS[@]}

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
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# zsh
echo "### Setting oh-my-zsh..."
## zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
## zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
## zsh-navigation-tools
git clone https://github.com/psprint/zsh-navigation-tools.git ~/.oh-my-zsh/custom/plugins/zsh-navigation-tools
alias-tips

# zshrc
echo "### Setting zsh..."
cp .zshrc ~/.zshrc
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

# done
echo "### init.sh done"