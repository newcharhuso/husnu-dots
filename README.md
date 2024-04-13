![Untitled design](https://github.com/newcharhuso/unix-porn/assets/83580410/6030788b-6418-4eb1-a1a6-4fcf929cb060)
![Screenshot from 2024-04-14 00-32-32](https://github.com/newcharhuso/unix-porn/assets/83580410/bc067a1b-52f9-437e-90a4-7121b04374f5)
![2024-04-14-004311_3840x1080_scrot](https://github.com/newcharhuso/unix-porn/assets/83580410/f43520a5-20e0-4811-9832-f479303ac131)
![image](https://github.com/newcharhuso/unix-porn/assets/83580410/03e701e7-74e0-46d4-a7de-255d2ac33332)
![image](https://github.com/newcharhuso/unix-porn/assets/83580410/1b58bc56-9622-4fc3-9840-8d75e07686af)

# Installation

## Installer script

You can place all the files yourself but I tried to create an installer. Couldn't try it yet so be crarefull about it.

## Manual
Copy the files inside the extensions directory to ~/.local/share/gnome-shell/extensions
Copy the files inside the icons directory to /usr/share/icons
Copy the files inside the themes directory to /usr/share/themes
Copy the files inside the tilix directory to ~/.config/tilix/schemes

For Firefox and rofi theme installations, please refer to cretor's repositories.

For spicetify run the following commands, if you have flatpak version enabled you need to specify the paths to your spotify installation and preferences location, be careful about not using '~' for your home folder, for more detailed installation explanation please refer to github page of the creators.

```
#If you've run spicetify before ignore the first line of code
spicetify backup apply
spicetify config current_scheme nord-light
spicetify config color_scheme nord-light
spicetify apply
```

For rofi themes, run the setup script. I am using launcher Type6-Style6 and applet powermenu type 5
```
nano ~/.config/rofi/launchers/type-6/launcher.sh 
```
Change the theme to  style-6.

Also for power menu:

```
nano ~/.config/rofi/applets/shared/theme.bash   
```
Then change theme and style:
```
type="$HOME/.config/rofi/applets/type-1"
style='style-1.rasi'
```

You can run these scripts to use the launcher and powermenu.

## Acknowledgments

This project utilizes work from the following projects and creators. Huge thanks to these contributors for their efforts:

### Firefox Theme
- **FF-ULTIMA** by Soulhotel: A customized Firefox user experience.  
  [FF-ULTIMA on GitHub](https://github.com/soulhotel/FF-ULTIMA)

### Rofi Launcher
- **Rofi Themes** by Aditya Shakya: A collection of Rofi themes.  
  [Rofi Themes on GitHub](https://github.com/adi1090x/rofi)

### Nala
- **Nala** by volian: A great frontend for apt.  
  [Nalka on GitLab](https://gitlab.com/volian/nala)

### Spicetify
- **Spicetify** by khannas: A tool for customizing the Spotify client.  
  [Spicetify on GitHub](https://github.com/khanhas/spicetify-cli)


### GNOME Shell Extensions
A special thanks to the creators of the Gnome Shell extensions that makes it really easy to do this:

- **AppIndicator and KStatusNotifierItem Support** by [3v1n0]
- **Application Volume Mixer** by [mymindstorm]
- **Aylur's Widgets** by [aylur]
- **Bluetooth Quick Connect** by [Extensions Valhalla]
- **Blur my Shell** by [aunetx]
- **Forge** by [forge-ext]
- **Fullscreen Avoider** by [Noobsai]
- **GSConnect** by [dlandau]
- **Transparent Window** by [heyheyco@gmail.com]
- **User Themes** by [fmuellner]

Please visit the respective extension pages for more information on each.
