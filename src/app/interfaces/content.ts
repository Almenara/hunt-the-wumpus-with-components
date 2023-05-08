import { types } from "./enums/types.enum";

export interface Content {
    type     : types;
    kill     : boolean;
    takeable : boolean;
    name     : string;
    icon     : string;   
}
