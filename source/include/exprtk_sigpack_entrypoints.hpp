#ifndef INCLUDE_EXPRTK_SIGPACK_ENTRYPOINTS_HPP
#define INCLUDE_EXPRTK_SIGPACK_ENTRYPOINTS_HPP

#include <exprtk.hpp>
#include <exprtk_sigpack.hpp>

#ifndef EXPRTK_EXPORT
#define EXPRTK_EXPORT extern "C" __attribute__((used))
#endif

namespace exprtk
{
    namespace sigpack
    {
        namespace entrypoints
        {
            using namespace exprtk::entrypoints;

            extern "C"
            {
                extern bool SymbolTable_AddPackageSigpack(symbol_table_t *symbol_table);
            }

            EXPRTK_EXPORT bool SymbolTable_AddPackageSigpack(symbol_table_t *symbol_table)
            {
                typedef exprtk::sigpack::package sigpack_package_t;
                sigpack_package_t *sigpack_package = new sigpack_package_t();
                bool ret = symbol_table->add_package(*sigpack_package);
                fflush(NULL);
                return ret;
            }
        }
    }
}

#endif
