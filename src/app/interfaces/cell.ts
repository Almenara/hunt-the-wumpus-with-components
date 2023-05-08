import { Content } from "./content";

export interface Cell {

    id      : number;
    shown   : boolean;
    content : Content[];
    hero    : boolean;
}
