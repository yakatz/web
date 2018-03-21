#!/bin/bash

function exp {
    ln -sfn /pool/mirrors/$1 $2
}

mkdir -p ros

exp amanda amanda
exp archlinux archlinux
exp calculate calculate
exp centos centos
exp ospdev download.ospdev.net
exp fedora fedora
exp findbugs findbugs
exp gentoo gentoo
exp gentoo-portage gentoo-portage
exp gimp gimp
exp gnome gnome
exp gnome GNOME
exp kernel kernel
exp kernel kernel.org
exp linuxmint linuxmint
exp mozdev mozdev
exp opensuse opensuse
exp ros-packages packages.ros.org
exp ros-packages ros/packages
exp ros-www/www/roswiki roswiki
exp sabayonlinux sabayonlinux
exp turnkeylinux turnkeylinux
exp ubuntu ubuntu
exp ubuntu-iso ubuntu-iso
exp xbmc xbmc
