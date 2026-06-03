---
title: Install Windows on a Contabo VPS
date: 2019-11-29
tagline: >-
  While Contabo does offer Windows Server, this solution uses your own custom
  Windows ISO, should work with any recent version of Windows and doesn't cost
  extra.
---

While [Contabo](https://contabo.com/) does offer Windows Server, this solution
uses your own custom Windows ISO, should work with any recent version of Windows
and doesn't cost extra.

This guide sets up a dual-boot. I don't recommend deleting Linux afterwards but
if you want to then that's up to you. Do not delete GRUB.

## Caveats/Notes:

- You need to supply an ISO for your Windows version.
- I have no idea if this is against any ToS. Use at your own risk.
- You will need at least _some_ knowledge of Linux commandline and how to work
  with GRUB.
- There are other ways to do this. This is just one.

## Background:

Contabo VPSes appear to run on [Proxmox](https://proxmox.com) with each VPS
simply being a QEMU/KVM virtual machine. Additionally, Contabo's VNC access lets
us interact with the system as it's booting, letting us boot anything we want as
long as it's on the local disk. Since you can't attach a DVD or iso to these
VMs, we will place the installer on a partition and chainload it with GRUB.

## Requirements:

- A [Contabo](https://contabo.com/) VPS running any Linux distribution.
- Access to the
  [Contabo Customer Control Panel](https://my.contabo.com/vservers).
- A Windows iso.
  - Windows Server 2012, 2016 and 2019 are guaranteed to work.
  - Windows 8.1 and 10 should theoretically also work, but have not been tested.
  - Windows 7 is not recommended.
- [VirtIO Drivers](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers#Windows_OS_support)
- A recent version of [Wimlib](https://wimlib.net/index.html) for Linux.
- Sufficient free space to resize your Linux partition and install Windows.
  Windows minimum requirements state this as 32GB for the latest version.
- You will also need space to fit the extracted installer, which can be up to
  5GB.

## Steps:

- Resize linux and create two extra partitions (sda3 and sda4), the first is
  your windows partition and the second is the installer and needs to be larger
  than the iso size.
- Format sda3 as ntfs (`mkfs.ntfs /dev/sda3 --fast`) and sda4 as ntfs also
  (`mkfs.ntfs /dev/sda4 --fast)`
- Mount sda4 and extract the ISO contents to it with 7z.
- Mount the boot.wim. (e.g.
  `wimlib-imagex mountrw /mnt/sources/boot.wim 1 /wim`)
- Extract the contents of a virtio iso to the mounted folder, unmount with
  `wimlib-imagex unmount /wim --commit`. (the `--commit` is important)
- Repeat for boot but use `2` as the image ID.
- Do the same on install.wim, using `wiminfo` to find which edition ID to mount,
  remember to commit on unmount.
- Edit `/etc/default/grub` and set the timeout to anything other than 0 so you
  have time to react. make sure to `update-grub`.
- Connect to the VNC console and reboot the VPS while connected. If it
  disconnects you from VNC, wait a few seconds before reconnecting.
- When GRUB shows up, quickly press `c` to enter a commandline and run:

<iframe width="100%" height="117" frameborder="0" src="https://nopaste.pages.dev/?l=js#XQAAAQAzAAAAAAAAAAA0m4rNiJXzQyqg2g3HCvFa6ZKTbtgSiKseF3SyuiuYMLXG0ENRc8nTrH0j+uw3TfCOn0um3/6bQQA="></iframe>

- Proceed through the installation, selecting your virtio-scsi drivers when
  prompted. You can also install graphics driver here to save time later, but
  it's not required.
- Install windows normally onto the NTFS partition you made earlier.
- At this point Windows should work, but GRUB will be erased so your Linux
  install is inaccessible. If that's fine stop here. Otherwise,
- Boot into any recovery image provided on your Contabo control panel.
- Mount your linux install, remember to put sda1 as its /boot (so `/mnt/boot` or
  w/e) and remember to bind `/dev`, `/sys` and `/proc`.
- `chroot` into your install and reinstall and update grub
  (`grub-install /dev/sda && update-grub`)
- `os-prober` will likely find windows, but chainloader doesnt work and GRUB
  gets a bit confused. If you don't want the stray windows entries, uninstall
  os-prober and update-grub again
- I recommend editing `/etc/grub.d/40_custom` and shoving something like this in
  it:

<iframe width="100%" height="171" frameborder="0" src="https://nopaste.pages.dev/?l=js#XQAAAQCIAAAAAAAAAAA2mUoiZ+QIUD9PtmuLK4fPPCzGr1Jm8YPq3b22V7uYz+ttmb0zy4tsapsv7j0e++es8Wt4wbl3w1jwmvVHtaj98le7fQESOqgrW5KJlofBzeLmCeqrr4Lfgx5xLiwbJZkfcACS/7xboAA="></iframe>

Hardcoding your device name isn't a great practise but this is a very specific
situation and I don't think the partition number of your windows install is
likely to change. You can of course use a GUID if you wish.

- At this point you can now use grub to switch OSes like you normally would.
  (But slightly more painful because you have to connect to VNC to access the
  menu, no way around this as far as I'm aware)
