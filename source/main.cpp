// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

#include <cstdio>
#include <iostream>
#include <string>
#include <exprtk_armadillo.hpp>
#include <exprtk_sigpack.hpp>

#include <exprtk_entrypoints.hpp>
#include <exprtk_armadillo_entrypoints.hpp>
#include <exprtk_sigpack_entrypoints.hpp>

int main(int argc, char* argv[])
{
   typedef exprtk::symbol_table<double> symbol_table_t;
   typedef exprtk::armadillo::package armadillo_package_t;
   typedef exprtk::sigpack::package sigpack_package_t;
   typedef exprtk::rtl::io::package<double> io_package_t;
   typedef exprtk::rtl::vecops::package<double> vecops_package_t;

   typedef exprtk::expression<double> expression_t;
   typedef exprtk::parser<double> parser_t;
   typedef exprtk::parser_error::type error_t;

   std::string exitFlag("--exit");
   for (int i = 0; i < argc; i++) {
      std::string currentFlag(argv[i]);
      if (currentFlag == exitFlag) {
         return 0;
      }
   }
   symbol_table_t symbol_table;
   armadillo_package_t armadillo_package;
   sigpack_package_t sigpack_package;
   io_package_t io_package;
   vecops_package_t vecops_package;
   double x = 0.0;
   double y = 0.0;
   double z = 0.0;

   symbol_table.add_constants();
   symbol_table.add_package(armadillo_package);
   symbol_table.add_package(sigpack_package);
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
