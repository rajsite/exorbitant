# The mkdir command has to be quoted so that it is not intercepted in the windows shell
# and instead uses the version on PATH (ie that is unix mkdir compatible)
MKDIR="mkdir"

COMPILER          := emcc
OPTIMIZATION_OPT  := -O3
BASE_OPTIONS      := -pedantic-errors -Wall -Wextra -Werror -Wno-long-long -s STANDALONE_WASM
OPTIONS           := $(BASE_OPTIONS) $(OPTIMIZATION_OPT)
LINKER_OPT        := -lm
EXPRTK_INCLUDE    := imports/exprtk/
ARMADILLO_INCLUDE := imports/armadillo-code/include/
SIGPACK_INCLUDE   := imports/sigpack/sigpack/
DEPS_INCLUDE      := -I$(EXPRTK_INCLUDE) -I$(ARMADILLO_INCLUDE) -I$(SIGPACK_INCLUDE)
DIST              := dist
SOURCE            := source/main.cpp

$(DIST):
	@$(MKDIR) -p $(DIST)

$(DIST)/exorbitant.js : $(SOURCE) | $(DIST)
	$(COMPILER) $(OPTIONS) $(DEPS_INCLUDE) $(SOURCE) $(LINKER_OPT) -o $@

.PHONY : build

build : $(DIST)/exorbitant.js
