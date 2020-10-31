# The mkdir command has to be quoted so that it is not intercepted in the windows shell
# and instead uses the version on PATH (ie that is unix mkdir compatible)
MKDIR="mkdir"

COMPILER          := emcc
BASE_OPTIONS      := -std=c++14 -pedantic-errors -Wall -Wextra -Werror -Wno-long-long
EM_OPT            := -s STANDALONE_WASM -s NO_DYNAMIC_EXECUTION=1 -s MODULARIZE=1 -s EXPORT_ES6=1 --minify 0 -s INVOKE_RUN=0
OPTIMIZATION_OPT  := -O3
OPTIONS           := $(BASE_OPTIONS) $(EM_OPT) $(OPTIMIZATION_OPT)
LINKER_OPT        := -lm
EXPRTK_INCLUDE    := imports/exprtk/
ARMADILLO_INCLUDE := imports/armadillo-code/include/
SIGPACK_INCLUDE   := imports/sigpack/sigpack/
DEPS_INCLUDE      := -isystem $(EXPRTK_INCLUDE) -isystem $(ARMADILLO_INCLUDE) -isystem $(SIGPACK_INCLUDE)
DIST              := dist
SOURCE            := source/main.cpp

$(DIST):
	@$(MKDIR) -p $(DIST)

$(DIST)/exorbitant.js : $(SOURCE) | $(DIST)
	$(COMPILER) $(OPTIONS) $(DEPS_INCLUDE) $(SOURCE) $(LINKER_OPT) -o $@

.PHONY : build

build : $(DIST)/exorbitant.js
