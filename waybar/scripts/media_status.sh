#!/bin/bash
# Script to display currently playing media for Waybar

ignore_players="firefox"
#Check if playerctl a player
if playerctl status &>/dev/null; then
	# Fetch the artist and title of the currently playing track
	title=$(playerctl --ignore-player=$ignore_players metadata title)

	# Check if any media is actually playing
	if [ "$(playerctl --player=chromium status)" = "Playing" ]; then
		echo 
	else
		echo 
	fi
else
	echo XX
fi
