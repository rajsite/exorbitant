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
            using namespace exprtk::entrypoints;
            typedef exprtk::armadillo::package<double> armadillo_package_t;

            extern "C"
            {
                extern armadillo_package_t *PackageArmadillo_Create();
                extern void PackageArmadillo_Destroy(armadillo_package_t *armadillo_package);
                extern bool SymbolTable_AddPackageArmadillo(symbol_table_t *symbol_table, armadillo_package_t *armadillo_package);
            }

            EXPRTK_EXPORT armadillo_package_t *PackageArmadillo_Create()
            {
                armadillo_package_t *armadillo_package = new armadillo_package_t();
                fflush(NULL);
                return armadillo_package;
            }

            EXPRTK_EXPORT void PackageArmadillo_Destroy(armadillo_package_t *armadillo_package)
            {
                delete armadillo_package;
                fflush(NULL);
            }

            EXPRTK_EXPORT bool SymbolTable_AddPackageArmadillo(symbol_table_t *symbol_table, armadillo_package_t *armadillo_package)
            {
                bool ret = symbol_table->add_package(*armadillo_package);
                fflush(NULL);
                return ret;
            }
        }
    }
}

#endif
