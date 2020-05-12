let mapleader = ","

set mouse=a

let $LANG='en' 
set langmenu=en

set nu rnu

set encoding=utf8

set nobackup
set nowb
set noswapfile

set ci "C-style indent
set ai "Auto indent
set si "Smart indent
set wrap "Wrap lines

set tabstop=2
set expandtab
set shiftwidth=2

set hlsearch
set incsearch 

set lbr
set tw=500

set ignorecase
set nocompatible
set background=dark
set ignorecase
set smartcase
set background=dark

set autoread
set lazyredraw 

set magic

set showmatch 

" No annoying sound on errors
set noerrorbells
set novisualbell
set t_vb=
set tm=500

set hid


" Enable filetype plugins
filetype plugin on
filetype indent on

if has("syntax")
  syntax on
endif

set rtp+=$HOME/.vim/bundle/Vundle.vim
call vundle#begin()
  Plugin 'VundleVim/Vundle.vim'
  Plugin 'scrooloose/nerdTree'
  Plugin 'vim-airline/vim-airline'
  Plugin 'christoomey/vim-tmux-navigator'
  Plugin 'vim-airline/vim-airline-themes'
call vundle#end()

let g:airline_theme='bubblegum'

filetype plugin indent on

" keymap
map <space> /
map <c-space> ?
map <leader>ss :setlocal spell!<cr>
map <leader>pp :setlocal paste!<cr>

map <leader>bd :Bclose<cr>:tabclose<cr>gT

"nmap <F2> :"NERDTreeToggle<CR>
set pastetoggle=<F3>

" :W sudo saves the file 
" (useful for handling the permission-denied error)
command W w !sudo tee % > /dev/null

nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>
nnoremap <leader>n :NERDTreeToggle<CR>

inoremap jk <esc>                          " esc 
inoremap zz <esc>:w<cr>                    " save files
nnoremap zz :w<cr>
inoremap zx <esc>:wq!<cr>                  " save and exit
noremap zx :wq!<cr>
inoremap qw <esc>:qa!<cr>
nnoremap qw :qa!<cr>

