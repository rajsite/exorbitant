#include <exprtk.hpp>
#include <armadillo>
#include <sigpack.h>
#include <exprtk.hpp>

using namespace arma;
using namespace sp;

namespace exprtk
{
   namespace exorbitant
   {
      #ifdef exprtk_enable_debugging
      #define exprtk_debug(params) printf params
      #else
      #define exprtk_debug(params) (void)0
      #endif

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

      struct conv : public exprtk::igeneric_function<double>
      {
         typedef typename exprtk::igeneric_function<double> igfun_t;
         typedef typename igfun_t::parameter_list_t    parameter_list_t;
         typedef typename igfun_t::generic_type        generic_type;
         typedef typename generic_type::scalar_view    scalar_t;
         typedef typename generic_type::vector_view    vector_t;

         conv() : exprtk::igeneric_function<double>("VVV") {}

         inline double operator() (parameter_list_t parameters)
         {
            vector_t signal1(parameters[0]);
            vector_t signal2(parameters[1]);
            vector_t signalConv(parameters[2]);

            vec A(signal1.begin(), signal1.size(), false, true);
            vec B(signal2.begin(), signal2.size(), false, true);

            vec C = arma::conv(A, B);

            memcpy(signalConv.begin(), C.memptr(), std::min((size_t)C.size(), signalConv.size()) * sizeof(double));
            return 1;
         }
      };

      struct package
      {
         fir1 fir1_f;
         conv conv_f;
         bool register_package(exprtk::symbol_table<double>& symtab)
         {
            #define exprtk_register_function(FunctionName,FunctionType)                  \
            if (!symtab.add_function(FunctionName,FunctionType))                         \
            {                                                                            \
               exprtk_debug((                                                            \
               "exorbitant::register_package - Failed to add function: %s\n", \
               FunctionName));                                                         \
               return false;                                                             \
            }                                                                            \

            exprtk_register_function("fir1", fir1_f)
            exprtk_register_function("conv", conv_f)
            #undef exprtk_register_function

            return true;
         }
      };

      #ifdef exprtk_debug
      #undef exprtk_debug
      #endif
   } // namespace exprtk::exorbitant
} // namespace exprtk
