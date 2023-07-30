#ifndef INCLUDE_EXPRTK_SIGPACK_HPP
#define INCLUDE_EXPRTK_SIGPACK_HPP

#include <exprtk.hpp>
#include <armadillo>

// Prevent the GPLOT import (uses popen calls)
#define SP_GPLOT_H
#include <sigpack.h>

#ifdef exprtk_enable_debugging
#define exprtk_debug(params) printf params
#else
#define exprtk_debug(params) (void)0
#endif

namespace exprtk
{
   namespace sigpack
   {
      using namespace arma;
      using namespace sp;

      struct fir1 : public exprtk::igeneric_function<double>
      {
         typedef typename exprtk::igeneric_function<double> igfun_t;
         typedef typename igfun_t::parameter_list_t    parameter_list_t;
         typedef typename igfun_t::generic_type        generic_type;
         typedef typename generic_type::scalar_view    scalar_t;
         typedef typename generic_type::vector_view    vector_t;

         fir1() : exprtk::igeneric_function<double>("TTV") {}

         inline double operator() (parameter_list_t parameters)
         {
            scalar_t order(parameters[0]);
            scalar_t cutOffFrequency(parameters[1]);
            vector_t coefficients(parameters[2]);

            vec b = sp::fir1(static_cast<int>(order()), cutOffFrequency());

            memcpy(coefficients.begin(), b.memptr(), std::min((size_t)b.size(), coefficients.size()) * sizeof(double));
            return 1;
         }
      };

      struct package
      {
         fir1 fir1_f;
         bool register_package(exprtk::symbol_table<double>& symtab)
         {
            #define exprtk_register_function(FunctionName,FunctionType)                  \
            if (!symtab.add_function(FunctionName,FunctionType))                         \
            {                                                                            \
               exprtk_debug((                                                            \
               "sigpack::register_package - Failed to add function: %s\n",               \
               FunctionName));                                                           \
               return false;                                                             \
            }                                                                            \

            exprtk_register_function("fir1", fir1_f)
            #undef exprtk_register_function

            return true;
         }
      };
   } // namespace exprtk::sigpack
} // namespace exprtk

#ifdef exprtk_debug
#undef exprtk_debug
#endif

#endif
