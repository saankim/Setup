# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=/Users/$USER/.oh-my-zsh

alias vim="nvim"
alias vi="nvim"
alias vimdiff="nvim -d"
export EDITOR=/usr/local/bin/nvim

# Android
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=${PATH}:~/bin
export PATH=$PATH:/usr/local/bin/mysql

alias git='LANG=en_GB git'
export PATH=$PATH:$HOME/bin:$PATH

# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
#ZSH_THEME="agnoster"
ZSH_THEME="refined"

autoload -U promptinit; promptinit
prompt pure

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

plugins=(
	git
	zsh-syntax-highlighting
	zsh-autosuggestions
	tmux
)

source $ZSH/oh-my-zsh.sh

# User configuration
# export LANG=en_US.UTF-8

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

alias tl='tmux ls'
alias ta='tmux attach -t'
alias tn='tmux new -s'
alias tt='tmux ls'

alias r='ranger'

source ~/.local/bin/bashmarks.sh

