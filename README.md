# VEX Internet Control Server
This is one part of a three part system used to control VEX robots over the internet. This part takes user input from a website and relays it to the robot via a serial connection from a Raspberry Pi to the VEX cortext. The website also displays various telemetry data from the robot (battery voltage, wifi signal, etc...).

![Control Panel](http://i.imgur.com/D2oPeUP.jpg)

# Our Team
* [Josh Ferrara](http://ferrara.space)
* [Austin Wulf](http://wulfbuilds.com)
* Pelin Ensari
* Silmey Sevilla

# Why We Did It
Being very interested in drones, our team felt like making our robot have an almost infinite range. Instead of just transmitting from the VEX controller with higher power, we went the route of incorporating the robot with the internet. As long as the robot has access to a WiFi network, you can drive it from **anywhere in the world**. One way to have guaranteed internet is by using a phone as a wireless hotspot. Slap the phone on the robot and as long as there's a cell signal, you have control. Keep in mind this route does comes with a downside as there is a slight delay due to network latency. Many buildings are also excellent at keeping out cell signal as well so once you're inside you could lose connection. These two issues led to us contacting our schools IT department. They ended up helping us a lot with getting us on the school wifi - don't underestimate them as they would definitely love to help with something like this. One other thing we added that was necessary was a tablet with Lync. This allowed for instantaneous video transmission on the school WiFi network from the controller tablet in one building, to the robot roaming the campus. You could also get away with using a cellphone and an alternate video chat client. There is a slight delay but that challenge is always fun to conquer.

# How It Works
There are essentially three components needed in order to make this system work. The first component would be the robot itself. As of now this code only works with VEX robots. (Of course, since we are just using a serial connection to communicate with the cortex, one could easily modify this to work with any microcontroller that supports serial communications.) The second component is the Raspberry Pi. This would be attached to the robot providing it internet access as well as a medium from translating the commands from the website into serial data for the Cortex. The third component is the web server. This accepts connections from someone who wishes to control the robot. Once you have all three of these components, you're ready to go.
#### Communication Diagram
VEX Cortex `<- Serial Connection ->` Raspberry PI `<- Internet ->` Web Server `<- Internet ->` Client

# Installation
To install the webserver, simply clone this repo to your computer: `git clone https://github.com/joshuaferrara/VEX-Internet-Control-Server.git`.

# Usage
Once installation is complete, `cd` into the new directory and execute this command `node index.js`. At this point, the web server will be up and running on port 3000. When you visit the site, a box will popup asking for a password. By pressing cancel, you will be in read-only mode and can not control the robot. If you enter the default password `oats`, you'll be able to control the robot with the `WASD` keys on your keyboard once the robot is connected and armed. Make sure to forward port 3000 on your router to allow for outside access. If you want to keep the webserver running forever, look into using the NodeJS module `forever` or `pm2`.

# Acknowledgements
[Santa Margarita Catholic High School](http://smhs.org/) - for providing us with a top-notch robotics class and teacher, Mr. Jason Lawrence.

# License
Creative Commons Attribution NonCommercial (CC-BY-NC)
