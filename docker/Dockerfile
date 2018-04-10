FROM phusion/baseimage:0.10.1
MAINTAINER contact.rafaelpr@gmail.com

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# ...put your own build instructions here..
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs

# Enabling SSH
RUN rm -f /etc/service/sshd/down

COPY id_rsa.pub /tmp/rafakey.pub

RUN cat /tmp/rafakey.pub >> /root/.ssh/authorized_keys && rm -f /tmp/rafakey.pub

RUN mkdir /app

WORKDIR /app

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
