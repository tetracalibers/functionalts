FROM phusion/baseimage:0.9.11
# c.f. https://github.com/phusion/baseimage-docker
MAINTAINER Akimichi Tatsukawa <akimichi.tatsukawa@gmail.com>
ENV REFRESHED_AT 2016-1-15(Fri)
## Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

ENV HOME /root
RUN /etc/my_init.d/00_regen_ssh_host_keys.sh

## apt-get update
RUN sed -i~ -e 's;http://archive.ubuntu.com/ubuntu;http://ftp.jaist.ac.jp/pub/Linux/ubuntu;' /etc/apt/sources.list
RUN apt-get -yqq update

## Japanese Environment
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y language-pack-ja
ENV LANG ja_JP.UTF-8
RUN update-locale LANG=ja_JP.UTF-8
RUN (mv /etc/localtime /etc/localtime.org && ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime)

## Development Environment
ENV EDITOR vim
RUN update-alternatives --set editor /usr/bin/vim.basic
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y git wget curl unzip build-essential python-dev rake

## node.js Environment
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update -qq
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs 

COPY .profile /root
RUN mkdir /workspace
COPY .nvmrc gulpfile.js package.json /workspace/
# COPY test /workspace/test/
# COPY succeeded /workspace/test/succeeded/
# COPY failed /workspace/test/failed/
COPY build.sbt /workspace
COPY project /workspace/project

## sbt インストール
ENV SCALA_VERSION 2.11.7
ENV SBT_VERSION 0.13.8

# INSTALL JAVA 7 add webupd8 repository
RUN \
    echo "===> add webupd8 repository..."  && \
    echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee /etc/apt/sources.list.d/webupd8team-java.list  && \
    echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list  && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886  && \
    apt-get update  && \
    \
    \
    echo "===> install Java"  && \
    echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections  && \
    echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections  && \
    DEBIAN_FRONTEND=noninteractive  apt-get install -y --force-yes oracle-java7-installer oracle-java7-set-default  && \
    \
    \
    echo "===> clean up..."  && \
    rm -rf /var/cache/oracle-jdk7-installer  && \
    apt-get clean  && \
    rm -rf /var/lib/apt/lists/*


# scala
RUN \
  cd /root && \
  curl -o scala-$SCALA_VERSION.tgz http://downloads.typesafe.com/scala/$SCALA_VERSION/scala-$SCALA_VERSION.tgz && \
  tar -xf scala-$SCALA_VERSION.tgz && \
  rm scala-$SCALA_VERSION.tgz 
#  sbt
RUN \
  curl  -L -o sbt-$SBT_VERSION.deb https://dl.bintray.com/sbt/debian/sbt-$SBT_VERSION.deb && \
  dpkg -i sbt-$SBT_VERSION.deb && \
  rm sbt-$SBT_VERSION.deb && \
  apt-get update 
  # apt-get update && \
  # apt-get install sbt


# Install nvm with node and npm

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
WORKDIR /root
ENV NODE_VERSION 0.12.0
# setup the nvm environment
# Install nvm with node and npm
RUN git clone https://github.com/creationix/nvm.git $HOME/.nvm
RUN bash \
    && source $HOME/.nvm/nvm.sh \
    && nvm install v$NODE_VERSION \
    && nvm alias default v$NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

RUN npm install -g node-gyp &&\
    npm install -g mocha &&\
    npm install -g gulp &&\
    npm install -g coffee-script

# install haskell

RUN export DEBIAN_FRONTEND=noninteractive && \
  apt-get update && \
  apt-get dist-upgrade -qqy && \
  apt-get install -qqy --no-install-recommends software-properties-common && \
  add-apt-repository -y ppa:hvr/ghc && \
  apt-get update && \
  apt-get install -qqy cabal-install-1.22 ghc-7.10.2 happy-1.19.5 alex-3.1.4 && \
  apt-get autoremove -qqy && \
  apt-get clean && apt-get autoclean && \
  rm -rf /usr/share/man/?? && rm -rf /usr/share/man/??_*

ENV PATH="${HOME}/.cabal/bin:/opt/cabal/1.22/bin:/opt/ghc/7.10.2/bin:${PATH}"


# ENV PATH /root/.cabal/bin:$PATH
# ENV HASKELL_PLATFORM_VERSION 2014.2.0.0

# RUN apt-get update && \
#   apt-get install -y zlib1g-dev curl libgmp10 && \
#   cd /usr/lib/x86_64-linux-gnu && \
#   ln -s libgmp.so.10 libgmp.so && \
#   cd / && \
#   curl -O http://www.haskell.org/platform/download/2014.2.0.0/haskell-platform-${HASKELL_PLATFORM_VERSION}-unknown-linux-x86_64.tar.gz && \
#   tar xzf haskell-platform-${HASKELL_PLATFORM_VERSION}-unknown-linux-x86_64.tar.gz && \
#   rm -f haskell-platform-${HASKELL_PLATFORM_VERSION}-unknown-linux-x86_64.tar.gz && \
#   /usr/local/haskell/ghc-7.8.3-x86_64/bin/activate-hs && \
#   cabal update && \
#   sed -i "s%^remote-repo: .*%remote-repo: stackage:http://www.stackage.org/stackage/46bb2d7487546939e22612e7d757f1df5a5163e9%" /root/.cabal/config && \
#   cabal update

VOLUME /workspace
WORKDIR /workspace
# RUN nvm use
RUN npm install
RUN sbt update

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#ENTRYPOINT ["/bin/bash", "--login", "-i", "-c"]
CMD ["bash"]
