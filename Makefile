# Default target

default: dev

#############################################################################################
# Settings
#############################################################################################

# OS
SHELL := /bin/bash --login
UNAME := $(shell uname)
HIDE := @
OPEN := $(shell if [[ '$(UNAME)' == 'Darwin' ]]; then echo open; else echo xdg-open; fi)
# In Linux, npm install -g requires sudo permission. In Mac, this is not necessary.
NPM_SUDO := $(shell if [[ '$(UNAME)' == 'Darwin' ]]; then echo; else echo sudo; fi)

# Colors
RED := '\x1b[0;31m'
GREEN := '\x1b[0;32m'
OFF := '\x1b[0m'

#############################################################################################
# Helper functions
#############################################################################################	

define BREW
	$(eval PKG_INSTALLED := $(shell brew ls --versions $(1)))
	$(eval PKG_OUTDATED := $(shell brew outdated | grep $(1)))
	$(HIDE)if [ -n "$(PKG_INSTALLED)" ]; then \
		if [ -n "$(PKG_OUTDATED)" ]; then \
			brew upgrade $(1); \
		fi \
	else \
		brew install $(1); \
	fi
endef

#############################################################################################
# Install
#############################################################################################

install: install-npm install-rvm install-sass install-mongodb install-redis

install-npm:
	$(HIDE)echo Installing npm dependencies
ifeq ($(UNAME),Linux)
	$(HIDE)sudo npm install -g requirejs grunt-cli karma jade nodemon --force
	$(HIDE)sudo rm -rf ~/tmp ~/.tmp ~/.npm
endif
	$(HIDE)npm install

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

install-redis:
		$(HIDE)echo Installing Redis
ifeq ($(UNAME),Linux)
	$(HIDE)sudo apt-get install redis-server
endif
ifeq ($(UNAME),Darwin)
	$(call BREW,"redis")
endif	

install-sass:
	@echo Installing sass
	@bundle install

install-mongodb:
	$(HIDE)echo Installing MongoDB
ifeq ($(UNAME),Linux)
	$(HIDE)sudo apt-get install mongodb
endif
ifeq ($(UNAME),Darwin)
	$(call BREW,"mongodb")
endif

#############################################################################################
# Clean
#############################################################################################

clean:
	@grunt clean
