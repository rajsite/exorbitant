#ifndef INCLUDE_EXPRTK_ARMADILLO_HPP
#define INCLUDE_EXPRTK_ARMADILLO_HPP

#include <exprtk.hpp>
#include <armadillo>

#ifdef exprtk_enable_debugging
#define exprtk_debug(params) printf params
#else
#define exprtk_debug(params) (void)0
#endif

namespace exprtk
{
   namespace armadillo
   {
      using namespace arma;

      template <typename T>
      struct conv : public exprtk::igeneric_function<T>
      {
         typedef typename exprtk::igeneric_function<T> igfun_t;
         typedef typename igfun_t::parameter_list_t    parameter_list_t;
         typedef typename igfun_t::generic_type        generic_type;
         typedef typename generic_type::scalar_view    scalar_t;
         typedef typename generic_type::vector_view    vector_t;

         conv() : exprtk::igeneric_function<T>("VVV") {}

         inline T operator() (parameter_list_t parameters)
         {
            vector_t signal1(parameters[0]);
            vector_t signal2(parameters[1]);
            vector_t signalConv(parameters[2]);

            Col<T> A(signal1.begin(), signal1.size(), false, true);
            Col<T> B(signal2.begin(), signal2.size(), false, true);

            Col<T> C = arma::conv(A, B);

            memcpy(signalConv.begin(), C.memptr(), std::min((size_t)C.size(), signalConv.size()) * sizeof(T));
            return 1;
         }
      };

      template <typename T>
      struct package
      {
         conv<T> conv_f;
         bool register_package(exprtk::symbol_table<T>& symtab)
         {
            #define exprtk_register_function(FunctionName,FunctionType)                  \
            if (!symtab.add_function(FunctionName,FunctionType))                         \
            {                                                                            \
               exprtk_debug((                                                            \
               "armadillo::register_package - Failed to add function: %s\n",             \
               FunctionName));                                                           \
               return false;                                                             \
            }                                                                            \

            exprtk_register_function("conv", conv_f)
            #undef exprtk_register_function

            return true;
         }
      };
   } // namespace exprtk::armadillo
} // namespace exprtk

#ifdef exprtk_debug
#undef exprtk_debug
#endif

#endif
