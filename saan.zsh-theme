# Use properly escaped colors in the git prompt
ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg[green]%}(#)%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY=" %{$fg[red]%}⚡%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=""

# Prompt character function (root vs. normal user)
function prompt_char {
    if [ $UID -eq 0 ]; then
        echo "%{$fg[red]%}#%{$reset_color%}"
    else
        echo
    fi
}

# Conda environment indicator
function prompt_condaenv {
    if [[ -n $CONDA_DEFAULT_ENV ]]; then
        print -Pn "%F{230}($(basename $CONDA_DEFAULT_ENV))"
    fi
}

# Main prompt
PROMPT='%(?, ,%{$fg[red]%}FAIL: $?%{$reset_color%}
)%{$fg_bold[blue]%}%~%{$reset_color%}$(git_prompt_info)
🍑 '

# Right-side prompt (time)
RPROMPT='%(j, %{$fg[yellow]%}%j 💼 %{$reset_color%},)%{$fg[green]%}[%*]%{$reset_color%}'
