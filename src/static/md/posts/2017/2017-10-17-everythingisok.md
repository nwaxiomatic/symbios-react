---
layout: media
title: "Everything Is Okay"
tags:
  categories: physical
ads: false
share: false
blurb: "WiFi-synchronized network of various physical computing devices including video, sound, and air pumps using custom web interface to sync and choreograph nodes. Uses ESP8266 NodeMCU, Arduino, Node.js, Intel Compute Sticks, VLC Python bindings, Catalex MP3, and OSC."
client: "Antoine Catala / 47 Canal"
image:
  id: 26891387199
photoset:
  id: 72157666807351669
---

In order to help Antoine realize his synchronized, physical-computing opera with video, pneumatic wall pieces, and animated singing scupltures, I created a suite of code to control and sync multiple WiFi-connected devices. This was accomplished with a OSC-based Node.js server running on an Intel Compute Stick along with multiple ESP8266 NodeMCU devices for the audio and pnematic pumps, as well as Compute Sticks running a Python-controlled version of VLC Player. All devices were programmed to work by simply restarting any device. The system is controlled via a web app which allows the gallery to update the time-triggers of the devices, monitor which devices are offline, to sync the system, and to play/stop the sequence of events at the beginning and end of the day, all remotely!

Photos courtesy of 47 Canal.