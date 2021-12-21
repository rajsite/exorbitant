// Copyright (c) 2020 Milan Raj
// SPDX-License-Identifier: MIT

#include <cstdio>
#include <iostream>
#include <string>
#include <exprtk.hpp>
#include <exorbitant.hpp>
#include <entrypoints.hpp>

using namespace exorbitant::entrypoints;

int main(int argc, char* argv[])
{
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
