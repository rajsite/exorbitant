/*
 **************************************************************
 *         C++ Mathematical Expression Toolkit Library        *
 *                                                            *
 * ExprTk Simple Calculator Example                           *
 * Author: Arash Partow (1999-2020)                           *
 * URL: http://www.partow.net/programming/exprtk/index.html   *
 *                                                            *
 * Copyright notice:                                          *
 * Free use of the Mathematical Expression Toolkit Library is *
 * permitted under the guidelines and in accordance with the  *
 * most current version of the MIT License.                   *
 * http://www.opensource.org/licenses/MIT                     *
 *                                                            *
 **************************************************************
*/

#define ARMA_DONT_USE_LAPACK
#define ARMA_DONT_USE_BLAS
#define ARMA_DONT_USE_NEWARP
#define ARMA_DONT_USE_ARPACK
#define ARMA_DONT_USE_SUPERLU
#define ARMA_DONT_USE_HDF5
#define ARMA_DONT_USE_OPENMP

#include <cstdio>
#include <iostream>
#include <string>

#include <armadillo>
#include "sigpack.h"
#include "exprtk.hpp"

using namespace arma;
using namespace sp;

struct fir1_sig_generic : public exprtk::igeneric_function<double>
{
   typedef typename exprtk::igeneric_function<double> igfun_t;
   typedef typename igfun_t::parameter_list_t    parameter_list_t;
   typedef typename igfun_t::generic_type        generic_type;
   typedef typename generic_type::scalar_view    scalar_t;
   typedef typename generic_type::vector_view    vector_t;

   fir1_sig_generic() : exprtk::igeneric_function<double>("TTV") {}

   inline double operator() (parameter_list_t parameters)
   {
      scalar_t order(parameters[0]);
      scalar_t cutOffFrequency(parameters[1]);
      vector_t coefficients(parameters[2]);

      vec M = fir1(static_cast<int>(order()), cutOffFrequency());

      memcpy(coefficients.begin(), M.memptr(), std::min((size_t)M.size(), coefficients.size()) * sizeof(double));
      return 0;
   }
};

struct conv_sig_generic : public exprtk::igeneric_function<double>
{
   typedef typename exprtk::igeneric_function<double> igfun_t;
   typedef typename igfun_t::parameter_list_t    parameter_list_t;
   typedef typename igfun_t::generic_type        generic_type;
   typedef typename generic_type::scalar_view    scalar_t;
   typedef typename generic_type::vector_view    vector_t;

   conv_sig_generic() : exprtk::igeneric_function<double>("VVV") {}

   inline double operator() (parameter_list_t parameters)
   {
      vector_t A_in(parameters[0]);
      vector_t B_in(parameters[1]);
      vector_t RESULT(parameters[2]);

      vec A(A_in.begin(), A_in.size(), false, true);
      vec B(B_in.begin(), B_in.size(), false, true);

      vec C = conv(A, B);

      memcpy(RESULT.begin(), C.memptr(), std::min((size_t)C.size(), RESULT.size()) * sizeof(double));
      return 0;
   }
};


int main()
{
   typedef exprtk::symbol_table<double> symbol_table_t;
   typedef exprtk::expression<double>     expression_t;
   typedef exprtk::parser<double>             parser_t;
   typedef exprtk::parser_error::type          error_t;

   exprtk::rtl::vecops::package<double> vecops_package;
   exprtk::rtl::io::package<double> io_package;

   symbol_table_t symbol_table;
   symbol_table.add_package(vecops_package);
   symbol_table.add_package(io_package);
   double x = 0.0;
   symbol_table.add_variable("x",x);
   double y = 0.0;
   symbol_table.add_variable("y",y);
   double z = 0.0;
   symbol_table.add_variable("z",z);
   fir1_sig_generic fir1_sig;
   symbol_table.add_function("fir1", fir1_sig);
   conv_sig_generic conv_sig;
   symbol_table.add_function("conv", conv_sig);
   symbol_table.add_constants();

   for ( ; ; )
   {
      expression_t expression;
      expression.register_symbol_table(symbol_table);

      std::string expression_str;

      std::cout << ">> ";
      std::getline(std::cin,expression_str);

      if (expression_str.empty())
         continue;
      else if (expression_str.find("exit") == 0)
         break;
      else if (expression_str.find("quit") == 0)
         break;

      parser_t parser;

      if (!parser.compile(expression_str,expression))
      {
         printf("Error: %s\tExpression: %s\n",
                parser.error().c_str(),
                expression_str.c_str());

         for (std::size_t i = 0; i < parser.error_count(); ++i)
         {
            error_t error = parser.get_error(i);
            printf("Err: %02d Pos: %02d Type: [%14s] Msg: %s\tExpression: %s\n",
                   static_cast<unsigned int>(i),
                   static_cast<unsigned int>(error.token.position),
                   exprtk::parser_error::to_str(error.mode).c_str(),
                   error.diagnostic.c_str(),
                   expression_str.c_str());
         }

         continue;
      }

      double result = expression.value();

      printf("result: %20.10f\n",result);
   }

   return 0;
}
