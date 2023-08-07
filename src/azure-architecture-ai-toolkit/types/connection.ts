import { Location } from "../enums/location";

export interface Connection {
    id?: string;
    objectType?: string;
    directionOfDataFlow?: string;
    connectedToParentOn: Location;
}