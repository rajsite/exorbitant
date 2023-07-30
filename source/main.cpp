// Copyright (c) 2021 Milan Raj
// SPDX-License-Identifier: MIT

#include <cstdio>
#include <iostream>
#include <string>

#include <exprtk_entrypoints.hpp>
#include <exprtk_armadillo_entrypoints.hpp>
#include <exprtk_sigpack_entrypoints.hpp>

extern "C" {
   void __cxa_allocate_exception() {
      abort();
   }

   void __cxa_throw() {
      abort();
   }
}

int main(int argc, char* argv[])
{
   using namespace exprtk::entrypoints;
   using namespace exprtk::armadillo::entrypoints;
   using namespace exprtk::sigpack::entrypoints;
   std::string exitFlag("--exit");
   for (int i = 0; i < argc; i++) {
      std::string currentFlag(argv[i]);
      if (currentFlag == exitFlag) {
         return 0;
      }
   }
   symbol_table_t *symbol_table = SymbolTable_Create();
   io_package_t *io_package = PackageIO_Create();
   vecops_package_t *vecops_package = PackageVecops_Create();
   armadillo_package_t *armadillo_package = PackageArmadillo_Create();
   sigpack_package_t *sigpack_package = PackageSigpack_Create();

   double x = 0.0;
   double y = 0.0;
   double z = 0.0;

   SymbolTable_AddConstants(symbol_table);
   SymbolTable_AddPackageIO(symbol_table, io_package);
   SymbolTable_AddPackageVecops(symbol_table, vecops_package);
   SymbolTable_AddPackageArmadillo(symbol_table, armadillo_package);
   SymbolTable_AddPackageSigpack(symbol_table, sigpack_package);
   SymbolTable_AddVariable(symbol_table, "x", &x);
   SymbolTable_AddVariable(symbol_table, "y", &y);
   SymbolTable_AddVariable(symbol_table, "z", &z);

   for ( ; ; )
   {
      expression_t *expression = Expression_Create();
      Expression_RegisterSymbolTable(expression, symbol_table);

      std::string expression_str;

      std::cout << ">> ";
      std::getline(std::cin,expression_str);

      if (expression_str.empty())
         continue;
      else if (expression_str.find("exit") == 0)
         break;
      else if (expression_str.find("quit") == 0)
         break;

      parser_t *parser = Parser_Create();
      if (!Parser_Compile(parser, expression_str.c_str(), expression)) {
         Parser_PrintError(parser);
      } else {
         double result = Expression_Value(expression);
         printf("result: %20.10f\n",result);
      }
   }

   return 0;
}
