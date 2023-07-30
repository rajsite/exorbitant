# Copyright (c) 2021 Milan Raj
# SPDX-License-Identifier: MIT

# The mkdir command has to be quoted so that it is not intercepted in the windows shell
# and instead uses the version on PATH (ie that is unix mkdir compatible)
MKDIR              := "mkdir"

CONFIGURATIONOPTS  := release development
CONFIGURATION      := release

ifeq ($(filter $(CONFIGURATION), $(CONFIGURATIONOPTS)),)
$(error invalid CONFIGURATION value, CONFIGURATION $(CONFIGURATION) not supported, supported configurations are $(CONFIGURATIONOPTS))
endif

COMPILER           := wasi-sdk/bin/clang++
BASE_OPTIONS       := --sysroot=wasi-sdk/share/wasi-sysroot -std=c++14 -pedantic-errors -Wall -Wextra -Werror -Wno-long-long -fno-exceptions
OPTIMIZATION_OPT   := -O3
ifeq ($(CONFIGURATION), development)
OPTIMIZATION_OPT   := -Dexprtk_disable_enhanced_features -O0
endif
LINKER_OPT         := -lm
EXPRTK_INCLUDE     := imports/exprtk/
ARMADILLO_INCLUDE  := imports/armadillo-code/include/
ARMADILLO_OPT      := -DARMA_DONT_USE_LAPACK -DARMA_DONT_USE_NEWARP -DARMA_DONT_USE_ARPACK -DARMA_DONT_USE_BLAS -DARMA_DONT_USE_SUPERLU -DARMA_DONT_USE_HDF5 -DARMA_DONT_USE_OPENMP -DARMA_DONT_USE_STD_MUTEX
SIGPACK_INCLUDE    := imports/sigpack/sigpack/
EXORBITANT_INCLUDE := source/include

OPTIONS            := $(BASE_OPTIONS) $(ARMADILLO_OPT) $(OPTIMIZATION_OPT)
DEPS_INCLUDE       := -isystem $(EXPRTK_INCLUDE) -isystem $(ARMADILLO_INCLUDE) -isystem $(SIGPACK_INCLUDE) -I${EXORBITANT_INCLUDE}
DIST               := dist
SOURCE             := source/main.cpp
DEPENDENCIES       :=   Makefile \
						package.json \
						package-lock.json \
						${EXORBITANT_INCLUDE}/exprtk_armadillo_entrypoints.hpp \
						${EXORBITANT_INCLUDE}/exprtk_armadillo.hpp \
						${EXORBITANT_INCLUDE}/exprtk_entrypoints.hpp \
						${EXORBITANT_INCLUDE}/exprtk_sigpack_entrypoints.hpp \
						${EXORBITANT_INCLUDE}/exprtk_sigpack.hpp

.DEFAULT_GOAL      := build

$(DIST) :
	@$(MKDIR) -p $(DIST)

$(DIST)/exorbitant.wasm : $(SOURCE) $(DEPENDENCIES) | $(DIST)
	$(COMPILER) $(OPTIONS) $(DEPS_INCLUDE) $(SOURCE) $(LINKER_OPT) -v -o $@

.PHONY : build

build : $(DIST)/exorbitant.wasm
