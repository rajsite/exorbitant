# The mkdir command has to be quoted so that it is not intercepted in the windows shell
# and instead uses the version on PATH (ie that is unix mkdir compatible)
MKDIR="mkdir"

COMPILER          := emcc
OPTIMIZATION_OPT  := -O3
BASE_OPTIONS      := -pedantic-errors -Wall -Wextra -Werror -Wno-long-long -s STANDALONE_WASM
OPTIONS           := $(BASE_OPTIONS) $(OPTIMIZATION_OPT)
LINKER_OPT        := -lm
EXPRTK_INCLUDE    := imports/exprtk/
ARMADILLO_INCLUDE := imports/armadillo/include/
SIGPACK_INCLUDE   := imports/sigpack/sigpack/
DEPS_INCLUDE      := -I$(EXPRTK_INCLUDE) -I$(ARMADILLO_INCLUDE) -I$(SIGPACK_INCLUDE)
DIST              := dist

$(DIST):
	@$(MKDIR) -p $(DIST)

$(DIST)/main.js : | $(DIST)
	$(COMPILER) $(OPTIONS) $(DEPS_INCLUDE) -o $(DIST)/main.js source/main.cpp $(LINKER_OPT)

.PHONY : build

build : $(DIST)/main.js
