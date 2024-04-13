#!/bin/bash

# Exit on error
set -e

# Ensure the script is run as root for certain operations
if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root" 1>&2
  exit 1
fi

echo "Copying extensions..."
cp -r extensions/* ~/.local/share/gnome-shell/extensions

echo "Copying icons..."
cp -r icons/* /usr/share/icons

echo "Copying themes..."
cp -r themes/* /usr/share/themes

# Check if spicetify is installed
if ! command -v spicetify &> /dev/null; then
    echo "spicetify could not be found, please install it first."
    exit 1
fi

echo "Applying spicetify theme..."
spicetify backup apply
spicetify config current_scheme nord-light
spicetify config color_scheme nord-light
spicetify apply

# Check if rofi is installed
if ! command -v rofi &> /dev/null; then
    echo "rofi could not be found, please install it first."
    exit 1
fi

echo "Installing rofi scripts..."
sh rofi/setup.sh

echo "Adding Cattpuccin-Frappe theme to tilix..."
cp tilix/* ~/.config/tilix/schemes

# Ask user for Firefox profile ID
echo "Please enter your Firefox profile folder name:"
read firefox_profile_id

# Define Firefox profile directory path
firefox_profile_path="$HOME/.mozilla/firefox/$firefox_profile_id"

# Create 'chrome' directory in the Firefox profile directory
echo "Creating 'chrome' directory in Firefox profile..."
mkdir -p "$firefox_profile_path/chrome"

# Copy files to the 'chrome' directory
echo "Copying files to '$firefox_profile_path/chrome'..."
cp -r firefox/* "$firefox_profile_path/chrome"

echo "Setup completed successfully."
