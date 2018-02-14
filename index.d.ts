// Type definitions for seqlogo
// Project: seqlogo
// Definitions by: LU Kuang-chen https://lukc.info

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace seqlogo;

/*~ If this module has methods, declare them as functions like so.
 */
export function makeLogo(id : string, pssm : PSSM, options : SeqLogoOption) : void;

/*~ You can declare types that are available via importing the module */
export interface PSSM {
    alphabet : string[];
    values : number[][];
}

export interface SeqLogoOption {
    width? : number;
    height? : number;
    style? : {
        width?: number;
        height? : number;
        font?: string;
    };
}

/*~ You can declare properties of the module using const, let, or var */
export const version: string;
