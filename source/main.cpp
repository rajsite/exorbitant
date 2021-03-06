// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

#include <cstdio>
#include <iostream>
#include <string>

#include <emscripten.h>
#define EXPORT extern "C" EMSCRIPTEN_KEEPALIVE
#include <armadillo>
#include "sigpack.h"
#include "exprtk.hpp"

using namespace arma;
using namespace sp;

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
} // namespace exorbitant

typedef exprtk::symbol_table<double>            symbol_table_t;
typedef exorbitant::package                     exorbitant_package_t;
typedef exprtk::rtl::io::package<double>        io_package_t;
typedef exprtk::rtl::vecops::package<double>    vecops_package_t;

typedef exprtk::expression<double>              expression_t;
typedef exprtk::parser<double>                  parser_t;
typedef exprtk::parser_error::type              error_t;

//TODO switch to embind / webidl?

extern "C" {
   extern symbol_table_t* SymbolTable_Create();
   extern bool SymbolTable_AddVariable(symbol_table_t* symbol_table, char* name_cstr, double* value);
   extern bool SymbolTable_AddVector(symbol_table_t* symbol_table, char* name_cstr, double* value, size_t size);
   extern expression_t* Expression_Create();
   extern void Expression_RegisterSymbolTable(expression_t* expression, symbol_table_t* symbol_table);
   extern double Expression_Value(expression_t* expression);
   extern parser_t* Parser_Create();
   extern bool Parser_Compile(parser_t* parser, char* expression_cstr, expression_t* expression);
}

EXPORT symbol_table_t* SymbolTable_Create() {
   symbol_table_t* symbol_table = new symbol_table_t();
   exorbitant_package_t* exorbitant_package = new exorbitant_package_t();
   io_package_t* io_package = new io_package_t();
   vecops_package_t* vecops_package = new vecops_package_t();

   symbol_table->add_constants();
   symbol_table->add_package(*exorbitant_package);
   symbol_table->add_package(*io_package);
   symbol_table->add_package(*vecops_package);
   fflush(NULL);
   return symbol_table;
}

EXPORT bool SymbolTable_AddVariable(symbol_table_t* symbol_table, char* name_cstr, double* value) {
   std::string name_str(name_cstr);
   bool ret = symbol_table->add_variable(name_str, *value);
   fflush(NULL);
   return ret;
}

EXPORT bool SymbolTable_AddVector(symbol_table_t* symbol_table, char* name_cstr, double* value, size_t size) {
   std::string name_str(name_cstr);
   bool ret = symbol_table->add_vector(name_str, value, size);
   fflush(NULL);
   return ret;
}

EXPORT expression_t* Expression_Create() {
   expression_t* expression = new expression_t();
   fflush(NULL);
   return expression;
}

EXPORT void Expression_RegisterSymbolTable(expression_t* expression, symbol_table_t* symbol_table) {
   expression->register_symbol_table(*symbol_table);
   fflush(NULL);
}

EXPORT double Expression_Value(expression_t* expression) {
   double ret = expression->value();
   fflush(NULL);
   return ret;
}

EXPORT parser_t* Parser_Create() {
   parser_t* parser = new parser_t();
   fflush(NULL);
   return parser;
}

EXPORT bool Parser_Compile(parser_t* parser, char* expression_cstr, expression_t* expression) {
   std::string expression_str(expression_cstr);
   bool ret = parser->compile(expression_str, *expression);
   if (!ret)
   {
      printf("Error: %s\tExpression: %s\n",
               parser->error().c_str(),
               expression_str.c_str());

      for (std::size_t i = 0; i < parser->error_count(); ++i)
      {
         error_t error = parser->get_error(i);
         printf("Err: %02d Pos: %02d Type: [%14s] Msg: %s\tExpression: %s\n",
                  static_cast<unsigned int>(i),
                  static_cast<unsigned int>(error.token.position),
                  exprtk::parser_error::to_str(error.mode).c_str(),
                  error.diagnostic.c_str(),
                  expression_str.c_str());
      }
   }
   fflush(NULL);
   return ret;
}

int main(int argc, char* argv[])
{
   // TODO strange things happen when running as a library in browsers if main is never called.
   // Find a way to control setup without needing to run main and immediately return
   std::string exitFlag("--exit");
   for (int i = 0; i < argc; i++) {
      std::string currentFlag(argv[i]);
      if (currentFlag == exitFlag) {
         return 0;
      }
   }
   symbol_table_t symbol_table;
   exorbitant_package_t exorbitant_package;
   io_package_t io_package;
   vecops_package_t vecops_package;
   double x = 0.0;
   double y = 0.0;
   double z = 0.0;

   symbol_table.add_constants();
   symbol_table.add_package(exorbitant_package);
   symbol_table.add_package(io_package);
   symbol_table.add_package(vecops_package);
   symbol_table.add_variable("x",x);
   symbol_table.add_variable("y",y);
   symbol_table.add_variable("z",z);

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
