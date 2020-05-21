#!/bin/bash

# homebrew
echo "### Installing brew"
if [[ ! $(which brew) ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
fi
brew update
brew cask update

# brew package
echo "### Installing brew packages..."
# package list
PACKAGES=(
  # autoconf
  # automake
  # sqlite3
  autojump
  bat
  dep
  docker
  fasd
  fd
  fzf
  gdbm
  gettext
  gh
  git
  go
  htop
  jq
  ncurses
  nmap
  openssl@1.1
  pcre
  pcre2
  pkg-config
  python
  python3
  ranger
  readline
  sqlite
  tmux
  tree
  watchman
  wget
  wget
  xz
  zsh
)
brew install ${PACKAGES[@]}

# brew apps
echo "### Installing brew cask applications..."
# applicaion list
APPLICATIONS=(
  cyberduck
  docker
  github
  google-chrome
  google-cloud-sdk
  hex-fiend
  idagio
  iina
  insomnia
  intel-power-gadget
  itsycal
  karabiner-elements
  keka
  kekadefaultapp
  ngrok
  notion
  setapp
  skype
  slack
  visual-studio-code
  wireshark
  zeplin
)
brew cask install ${APPLICATIONS[@]}

# brew fonts
echo "### Installing brew cask fonts..."
brew tap homebrew/cask-fonts
FONTS=(
  font-d2coding
  font-fira-code
  font-hack-nerd-font
)
brew cask install ${FONTS[@]}

# tidy brew
echo "### Tidy brew..."
brew cleanup
brew doctor

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

# tmux
echo "### Setting tmux..."
cp ./tat /usr/local/bin
cp tmux.conf ~/.tmux.conf

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
