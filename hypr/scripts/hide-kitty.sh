#! /bin/sh -

# Print various information, option: -v
verbose=0
# Position spawned window at X Y of terminal, option: -p
poschild=0
# Reparent to terminal
reparent=0

# ENABLE JOB CONTROL
set -m

print_help() {
    cat<<-EOF
    Usage: $(basename "$0") [OPTION] program [args ...]
      Hide terminal window by unmapping until program exits.
      Do Ctrl+C when using -r / -p if program fails.
    OPTIONS
      -p  Position child at X Y of terminal.
      -r  Reparent. Set it as child of terminal.
      -v  Verbose. Print geometry.
      -h  This help.
    EOF
}
print_geom() {
    cat<<-EOF
    WIN-ID  $WINDOW
    POS     $X $Y
    SIZE    $WIDTH $HEIGHT
    EOF
}
# DEFINES by Evil Eval
#   WINDOW (window id)
#   X Y
#   WIDTH HEIGHT
#   SCREEN
get_win_geom() {
    eval "$(xdotool getactivewindow getwindowgeometry --shell)"
}
# RESTORE Terminal Geom
set_win_geom() {
    xdotool windowmove "$WINDOW" "$X" "$Y"
    xdotool windowsize "$WINDOW" "$WIDTH" "$HEIGHT"
}
# HIDE current terminal
term_hide() {
    xdotool windowunmap "$WINDOW"
}
# RESTORE Terminal
term_show() {
    xdotool windowmap "$WINDOW"
    # On remapping window can loose original position
    # Restore to pre-unmap values
    set_win_geom
}
# Position program at X Y of terminal
# Using -sync has two effects:
#   1. Need to wait for window to appear
#   2. If command fails it hangs, and we can
#      abort with Ctrl+C
# Use --onlyvisible as windows can have a range of sub-windows.
# This could likely be done better.
pos_child() {
    wid="$(xdotool search --sync --pid "$1" --onlyvisible --limit 1 --all)"
    xdotool windowmove "$wid" "$X" "$Y"
}
# Adopt the child process's window
win_reparent() {
    wid="$(xdotool search --sync --pid "$1" --onlyvisible --limit 1 --all)"
    xdotool windowreparent "$wid" "$WINDOW"
}
# Bring process to foreground after mapping, moving etc.
fg_cpid() {
    if ! kill -0 "$cpid" 2>/dev/null || ! fg %1 >/dev/null; then
        printf 'Failed\n' >&2
        return 1
    fi
}
while [ -n "$1" ]; do
    case "$1" in
    '-h'|--help) print_help >&2 ; exit 1 ;;
    '-v') verbose=1 ;;
    '-p') poschild=1 ;;
    '-r') reparent=1 ;;
    *) break ;;
    esac
    shift
done
get_win_geom
[ $verbose -eq 1 ] && print_geom >&2

# Order of operation can be of importance here.
# Start child before unmap
command "$@" &
cpid="$!"

[ $poschild -eq 1 ] && pos_child "$cpid"
[ $verbose -eq 1 ] && jobs -l
if [ $reparent -eq 1 ]; then
    win_reparent "$cpid"
    fg_cpid || exit 1
else
    term_hide
    fg_cpid || exit 1
    # Restore when child departs
    term_show
fi
