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
bat
ffmpeg
gh
htop
icu4c@75
imagemagick
node
pipx
pueue
python-packaging
syncthing
websocketd
wget
z
)
brew install ${PACKAGES[@]}

# brew apps
echo "### Installing brew cask applications..."
# applicaion list
APPLICATIONS=(
betterdisplay
chatgpt
claude
coconutbattery
discord
drawio
dropbox
font-d2coding
font-dejavu
font-gowun-batang
font-jeju-myeongjo
font-jetbrains-mono
font-ko-pub-batang
font-liberation
font-liberation-mono-for-powerline
font-nanum-brush-script
font-nanum-gothic
font-nanum-gothic-coding
font-nanum-myeongjo
font-nanum-pen-script
font-new-york
font-noto-sans-kr
font-noto-serif
font-noto-serif-kr
font-pretendard
font-sf-compact
font-sf-mono
font-sf-pro
gephi
google-chrome
iina
input-source-pro
karabiner-elements
keka
keyboardcleantool
latest
mactex
millie
notion
qlcolorcode
qlstephen
quicklook-json
setapp
sf-symbols
tabby
tailscale
texifier
tradingview
typinator
visual-studio-code
zoom
zotero
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
