# Default target

default: dev

#############################################################################################
# Settings
#############################################################################################

# OS
SHELL := /bin/bash --login
UNAME := $(shell uname)
OPEN := $(shell if [[ '$(UNAME)' == 'Darwin' ]]; then echo open; else echo xdg-open; fi)
# In Linux, npm install -g requires sudo permission. In Mac, this is not necessary.
NPM_SUDO := $(shell if [[ '$(UNAME)' == 'Darwin' ]]; then echo; else echo sudo; fi)

# Colors
RED := '\x1b[0;31m'
GREEN := '\x1b[0;32m'
OFF := '\x1b[0m'

#############################################################################################
# Install
#############################################################################################

install: install-nodejs install-npm install-rvm install-sass install-screen

install-nodejs:
	@echo Installing Node.js
ifeq ($(UNAME),Linux)
	@sudo apt-get update
	@sudo apt-get install -y python-software-properties python g++ make
	@sudo add-apt-repository -y ppa:chris-lea/node.js
	@sudo apt-get update
	@sudo apt-get install nodejs
endif
ifeq ($(UNAME),Darwin)
	@ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
	@brew update
	@brew upgrade
	@brew install node
endif

install-npm:
	@echo Installing npm dependencies
	@$(NPM_SUDO) npm install -g requirejs clean-css karma grunt-cli less typescript jade bower
	@sudo rm -rf ~/tmp
	@npm install

install-rvm:
	@echo Installing rvm
	@if [ ! -f ~/.rvm/scripts/rvm ]; then \
		\curl -sSL https://get.rvm.io | bash -s stable; \
	fi

	@. ~/.rvm/scripts/rvm
	@rvm reload
	@rvm install 2.0.0
	@rvm default use 2.0.0
	@gem install bundler

install-sass:
	@echo Installing sass
	@gem install sass --pre

install-screen:
ifeq ($(UNAME),Linux)
	@sudo apt-get update
	@sudo apt-get install -y python-software-properties python g++ make
	@sudo add-apt-repository -y ppa:chris-lea/node.js
	@sudo apt-get update
	@sudo apt-get install nodejs
endif
ifeq ($(UNAME),Darwin)
	@brew install screen
endif

clean:
	@grunt clean
