#ifndef INCLUDE_EXPRTK_ARMADILLO_ENTRYPOINTS_HPP
#define INCLUDE_EXPRTK_ARMADILLO_ENTRYPOINTS_HPP

#include <exprtk.hpp>
#include <exprtk_armadillo.hpp>

#ifndef EXPRTK_EXPORT
#define EXPRTK_EXPORT extern "C" __attribute__((used))
#endif

namespace exprtk
{
    namespace armadillo
    {
        namespace entrypoints
        {
            typedef symbol_table<double> symbol_table_t;
            typedef exprtk::armadillo::package armadillo_package_t;

            extern "C"
            {
                extern bool SymbolTable_AddPackageArmadillo(symbol_table_t *symbol_table);

            }

            EXPRTK_EXPORT bool SymbolTable_AddPackageArmadillo(symbol_table_t *symbol_table)
            {
                armadillo_package_t *armadillo_package = new armadillo_package_t();
                bool ret = symbol_table->add_package(*armadillo_package);
                fflush(NULL);
                return ret;
            }
        }
    }
}

#endif
