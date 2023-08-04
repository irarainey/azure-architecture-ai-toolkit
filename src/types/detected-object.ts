import { BoundingBox } from "@azure/cognitiveservices-customvision-prediction/esm/models";
import { Connection } from "./connection";

export interface DetectedObject {
    id: string;
    objectType?: string;
    generateCode?: boolean;
    boundingBox?: BoundingBox;
    connectedObjects: Connection[];
}