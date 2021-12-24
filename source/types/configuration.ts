export type configuration = {
    expression: string,
    symbolTable?: {
        variables?:
        {
            name: string,
            value?: number
        }[],
        vectors?:
        {
            name: string,
            size: number,
            // Allow array-like objects (ie Float32Array) or any[]
            // Use any[] to avoid checking type of each member at runtime
            value?: {length: number} | any[]
        }[]
    }
};
