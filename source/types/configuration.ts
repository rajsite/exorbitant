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
            value?: number[]
        }[]
    }
};
