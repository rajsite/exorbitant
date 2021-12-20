# Copyright (c) 2020 Milan Raj
# SPDX-License-Identifier: MIT

# The mkdir command has to be quoted so that it is not intercepted in the windows shell
# and instead uses the version on PATH (ie that is unix mkdir compatible)
MKDIR="mkdir"

COMPILER          := emcc
BASE_OPTIONS      := -std=c++14 -pedantic-errors -Wall -Wextra -Werror -Wno-long-long
EM_PREJS          := source/prejs
EM_OPT            := -s STANDALONE_WASM -s NO_DYNAMIC_EXECUTION=1 -s MODULARIZE=1 -s EXPORT_ES6=1 --minify 0 -s INVOKE_RUN=1 -s FILESYSTEM=0 -s EXPORT_NAME=exorbitant --pre-js $(EM_PREJS)
EM_EXPORTS        := -s EXPORTED_FUNCTIONS="['_malloc', '_free']" -s EXPORTED_RUNTIME_METHODS="['stackAlloc', 'stackSave', 'stackRestore', 'stringToUTF8', 'UTF8ArrayToString']"
OPTIMIZATION_OPT  := -O3
LINKER_OPT        := -lm
EXPRTK_INCLUDE    := imports/exprtk/
# EXPRTK_OPT        := -Dexprtk_disable_enhanced_features
EXPRTK_OPT        :=
ARMADILLO_INCLUDE := imports/armadillo-code/include/
ARMADILLO_OPT     := -DARMA_DONT_USE_LAPACK -DARMA_DONT_USE_NEWARP -DARMA_DONT_USE_ARPACK -DARMA_DONT_USE_BLAS -DARMA_DONT_USE_SUPERLU -DARMA_DONT_USE_HDF5 -DARMA_DONT_USE_OPENMP
SIGPACK_INCLUDE   := imports/sigpack/sigpack/
OPTIONS           := $(BASE_OPTIONS) $(EM_OPT) $(EM_EXPORTS) $(EXPRTK_OPT) $(ARMADILLO_OPT) $(OPTIMIZATION_OPT)
DEPS_INCLUDE      := -isystem $(EXPRTK_INCLUDE) -isystem $(ARMADILLO_INCLUDE) -isystem $(SIGPACK_INCLUDE)
DIST              := dist
SOURCE            := source/main.cpp

.DEFAULT_GOAL := build

$(DIST):
	@$(MKDIR) -p $(DIST)

$(DIST)/exorbitant.js : $(SOURCE) | $(DIST)
	$(COMPILER) $(OPTIONS) $(DEPS_INCLUDE) $(SOURCE) $(LINKER_OPT) -o $@

$(DIST)/exorbitant.umd.js: $(DIST)/exorbitant.js $(EM_PREJS) source/index.js
	npm run build

.PHONY : build

build : $(DIST)/exorbitant.umd.js
