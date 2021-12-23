# exorbitant
Web calculator library

## Example cli usage

1. Open [the demo link](https://webassembly.sh/?run-command=exorbitant) to run the exorbitant REPL on the WebAssembly.sh.
2. Run the following example math expression:
    ```
    var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);
    ```

## Example node usage
```js
const {createExprtk} = require('exorbitant');
(async function () {
    const exprtk = await createExprtk();
    const symbolTable = exprtk.createSymbolTable();
    const expression = exprtk.createExpression();
    const parser = exprtk.createParser();

    expression.registerSymbolTable(symbolTable);
    parser.compile(`var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);`, expression);
    expression.value();
}()).catch(ex => console.log(ex));
```
