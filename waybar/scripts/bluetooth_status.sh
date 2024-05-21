#!/bin/bash
# Script to display Bluetooth status for Waybar

# Get the power state of Bluetooth
power_state=$(bluetoothctl show | grep "Powered:" | awk '{print $2}')

if [ "$power_state" == "yes" ]; then
    # Bluetooth is on, check for connected devices
    connected_device=$(bluetoothctl info | grep "Name:" | awk '{$1=""; print $0}' | sed 's/^[ \t]*//')

    if [ -z "$connected_device" ]; then
        # No devices are connected
        echo "{\"text\": \"\", \"tooltip\": \"Bluetooth ON: No devices connected\", \"class\": \"on\"}"
    else
        # A device is connected
        echo "{\"text\": \" $connected_device\", \"tooltip\": \"Connected to $connected_device\", \"class\": \"connected\"}"
    fi
else
    # Bluetooth is off
    echo "{\"text\": \"\", \"tooltip\": \"Bluetooth OFF\", \"class\": \"off\"}"
fi
