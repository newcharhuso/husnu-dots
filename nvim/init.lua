-- bootstrap lazy.nvim, LazyVim and your plugins
require("config.lazy")
vim.cmd([[
autocmd VimEnter * highlight LineNr guifg=#85c1dc
autocmd VimEnter * highlight CursorLineNr guifg=#ea999c
]])
