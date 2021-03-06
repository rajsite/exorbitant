# exorbitant
Web calculator library

## Example cli usage

1. Go to [WebAssembly.sh](https://webassembly.sh/).
2. Run the command `exorbitant` to start the exorbitant REPL.
3. Run the following example command:
    ```
    var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);
    ```

## Example node usage
```js
const {createExorbitant} = require('exorbitant');
(async function () {
    const exorbitant = await createExorbitant();
    const symbolTable = exorbitant.createSymbolTable();
    const expression = exorbitant.createExpression();
    const parser = exorbitant.createParser();

    expression.registerSymbolTable(symbolTable);
    parser.compile(`var a[15]:={1}; var b[8]; fir1(7,0.35,b); var c[22]; conv(a,b,c); print(c);`, expression);
    expression.value();
}()).catch(ex => console.log(ex));
```
