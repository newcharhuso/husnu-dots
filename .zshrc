# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [ "$TERM" = linux ] && command -v ttyscheme >/dev/null; then
	ttyscheme "gruvbox"
fi


if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git
	 zsh-autosuggestions
	 zsh-syntax-highlighting
	 dirhistory
)

eval $(thefuck --alias hasktir)
source $ZSH/oh-my-zsh.sh

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
eval "$(atuin init zsh)"

alias sourceidf="source /opt/esp-idf/export.sh"
alias idf="idf.py"
alias please="sudo"
alias ub="distrobox enter ubuntu"
alias vim="nvim"
export PATH=$PATH:/home/husnu/.spicetify
cat ~/.cache/wal/sequences
