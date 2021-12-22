#ifndef INCLUDE_EXPRTK_ENTRYPOINTS_HPP
#define INCLUDE_EXPRTK_ENTRYPOINTS_HPP

#include <exprtk.hpp>

#ifndef EXPRTK_EXPORT
#define EXPRTK_EXPORT extern "C" __attribute__((used))
#endif

namespace exprtk
{
    namespace entrypoints
    {
        typedef symbol_table<double> symbol_table_t;
        typedef rtl::io::package<double> io_package_t;
        typedef rtl::vecops::package<double> vecops_package_t;

        typedef expression<double> expression_t;
        typedef parser<double> parser_t;
        typedef parser_error::type error_t;

        extern "C"
        {
            extern symbol_table_t *SymbolTable_Create();
            extern bool SymbolTable_AddPackageIO(symbol_table_t *symbol_table);
            extern bool SymbolTable_AddPackageVecops(symbol_table_t *symbol_table);
            extern bool SymbolTable_AddVariable(symbol_table_t *symbol_table, char *name_cstr, double *value);
            extern bool SymbolTable_AddVector(symbol_table_t *symbol_table, char *name_cstr, double *value, size_t size);
            extern expression_t *Expression_Create();
            extern void Expression_RegisterSymbolTable(expression_t *expression, symbol_table_t *symbol_table);
            extern double Expression_Value(expression_t *expression);
            extern parser_t *Parser_Create();
            extern bool Parser_Compile(parser_t *parser, char *expression_cstr, expression_t *expression);
        }

        EXPRTK_EXPORT symbol_table_t *SymbolTable_Create()
        {
            symbol_table_t *symbol_table = new symbol_table_t();
            symbol_table->add_constants();
            fflush(NULL);
            return symbol_table;
        }

        EXPRTK_EXPORT bool SymbolTable_AddPackageIO(symbol_table_t *symbol_table)
        {
            io_package_t *io_package = new io_package_t();
            bool ret = symbol_table->add_package(*io_package);
            fflush(NULL);
            return ret;
        }

        EXPRTK_EXPORT bool SymbolTable_AddPackageVecops(symbol_table_t *symbol_table)
        {
            vecops_package_t *vecops_package = new vecops_package_t();
            bool ret = symbol_table->add_package(*vecops_package);
            fflush(NULL);
            return ret;
        }

        EXPRTK_EXPORT bool SymbolTable_AddVariable(symbol_table_t *symbol_table, char *name_cstr, double *value)
        {
            std::string name_str(name_cstr);
            bool ret = symbol_table->add_variable(name_str, *value);
            fflush(NULL);
            return ret;
        }

        EXPRTK_EXPORT bool SymbolTable_AddVector(symbol_table_t *symbol_table, char *name_cstr, double *value, size_t size)
        {
            std::string name_str(name_cstr);
            bool ret = symbol_table->add_vector(name_str, value, size);
            fflush(NULL);
            return ret;
        }

        EXPRTK_EXPORT expression_t *Expression_Create()
        {
            expression_t *expression = new expression_t();
            fflush(NULL);
            return expression;
        }

        EXPRTK_EXPORT void Expression_RegisterSymbolTable(expression_t *expression, symbol_table_t *symbol_table)
        {
            expression->register_symbol_table(*symbol_table);
            fflush(NULL);
        }

        EXPRTK_EXPORT double Expression_Value(expression_t *expression)
        {
            double ret = expression->value();
            fflush(NULL);
            return ret;
        }

        EXPRTK_EXPORT parser_t *Parser_Create()
        {
            parser_t *parser = new parser_t();
            fflush(NULL);
            return parser;
        }

        EXPRTK_EXPORT bool Parser_Compile(parser_t *parser, char *expression_cstr, expression_t *expression)
        {
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
                           parser_error::to_str(error.mode).c_str(),
                           error.diagnostic.c_str(),
                           expression_str.c_str());
                }
            }
            fflush(NULL);
            return ret;
        }

    }
}
#endif
