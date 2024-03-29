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

COMPILER           := emcc
BASE_OPTIONS       := -std=c++14 -pedantic-errors -Wall -Wextra -Werror -Wno-long-long -fno-exceptions
EM_EXPORTNAME      := exprtkcore
EM_PREJS           := source/utility/pre.js
EM_POSTJS          := source/utility/post.js
EM_EXTERNPREJS     := source/utility/extern-pre.js
EM_OPT             := -s STANDALONE_WASM -s NO_DYNAMIC_EXECUTION=1 -s MODULARIZE=1 -s EXPORT_ES6=1 --minify 0 -s INVOKE_RUN=1 -s FILESYSTEM=0 -s EXPORT_NAME=$(EM_EXPORTNAME) --pre-js $(EM_PREJS) --post-js $(EM_POSTJS) --extern-pre-js $(EM_EXTERNPREJS) --minify 0
EM_EXPORTS         := -s EXPORTED_FUNCTIONS="['_malloc', '_free']" -s EXPORTED_RUNTIME_METHODS="['stackAlloc', 'stackSave', 'stackRestore', 'stringToUTF8', 'UTF8ArrayToString']"
OPTIMIZATION_OPT   := -O3
ifeq ($(CONFIGURATION), development)
OPTIMIZATION_OPT   := -Dexprtk_disable_enhanced_features -O0 -s ERROR_ON_WASM_CHANGES_AFTER_LINK -s WASM_BIGINT
endif
LINKER_OPT         := -lm
EXPRTK_INCLUDE     := imports/exprtk/
ARMADILLO_INCLUDE  := imports/armadillo-code/include/
ARMADILLO_OPT      := -DARMA_DONT_USE_LAPACK -DARMA_DONT_USE_NEWARP -DARMA_DONT_USE_ARPACK -DARMA_DONT_USE_BLAS -DARMA_DONT_USE_SUPERLU -DARMA_DONT_USE_HDF5 -DARMA_DONT_USE_OPENMP
SIGPACK_INCLUDE    := imports/sigpack/sigpack/
EXORBITANT_INCLUDE := source/include

OPTIONS            := $(BASE_OPTIONS) $(EM_OPT) $(EM_EXPORTS) $(ARMADILLO_OPT) $(OPTIMIZATION_OPT)
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
						${EXORBITANT_INCLUDE}/exprtk_sigpack.hpp \
						$(EM_PREJS) \
						$(EM_POSTJS) \
						$(EM_EXTERNPREJS)
DEPENDENCIESJS     :=   $(DIST)/$(EM_EXPORTNAME).js \
						$(DIST)/types/configuration.js \
						$(DIST)/vendor/comlink.js \
                        source/exorbitant-in-process.js \
                        source/exorbitant-worker.js \
                        source/exorbitant.js \
						source/exprtk.js

.DEFAULT_GOAL      := build

$(DIST) :
	@$(MKDIR) -p $(DIST)

$(DIST)/$(EM_EXPORTNAME).js : $(SOURCE) $(DEPENDENCIES) | $(DIST)
	$(COMPILER) $(OPTIONS) $(DEPS_INCLUDE) $(SOURCE) $(LINKER_OPT) -o $@

$(DIST)/types/configuration.js : source/types/configuration.ts
	npm run make:validator

$(DIST)/vendor/comlink.js : source/vendor/comlink.js
	npm run make:vendor

$(DIST)/exorbitant.js : $(DEPENDENCIESJS)
	npm run make:bundle

.PHONY : build

build : $(DIST)/exorbitant.js
