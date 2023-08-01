#ifndef INCLUDE_EXPRTK_SIGPACK_ENTRYPOINTS_HPP
#define INCLUDE_EXPRTK_SIGPACK_ENTRYPOINTS_HPP

#include <exprtk.hpp>
#include <exprtk_sigpack.hpp>

#ifndef EXPRTK_EXPORT
#define EXPRTK_EXPORT(EXPORTNAME) extern "C" __attribute__((export_name(EXPORTNAME)))
#endif

namespace exprtk
{
    namespace sigpack
    {
        namespace entrypoints
        {
            using namespace exprtk::entrypoints;
            typedef exprtk::sigpack::package sigpack_package_t;

            extern "C"
            {
                extern sigpack_package_t *PackageSigpack_Create();
                extern void PackageSigpack_Destroy(sigpack_package_t *sigpack_package);
                extern bool SymbolTable_AddPackageSigpack(symbol_table_t *symbol_table, sigpack_package_t *sigpack_package);
            }

            EXPRTK_EXPORT("PackageSigpack_Create") sigpack_package_t *PackageSigpack_Create()
            {
                sigpack_package_t *sigpack_package = new sigpack_package_t();
                fflush(NULL);
                return sigpack_package;
            }

            EXPRTK_EXPORT("PackageSigpack_Destroy") void PackageSigpack_Destroy(sigpack_package_t *sigpack_package)
            {
                delete sigpack_package;
                fflush(NULL);
            }

            EXPRTK_EXPORT("SymbolTable_AddPackageSigpack") bool SymbolTable_AddPackageSigpack(symbol_table_t *symbol_table, sigpack_package_t *sigpack_package)
            {
                bool ret = symbol_table->add_package(*sigpack_package);
                fflush(NULL);
                return ret;
            }
        }
    }
}

#endif
