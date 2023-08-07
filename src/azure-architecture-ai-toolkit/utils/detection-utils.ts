import { BoundingBox, Prediction } from "@azure/cognitiveservices-customvision-prediction/esm/models";
import { v4 as uuidv4 } from "uuid";
import { DetectedObject } from "../types/detected-object";
import { Location } from "../enums/location";
import { Connection } from "../types/connection";

// List of objects to exclude from code generation
const codeGenerationExcludeList: string[] = ["right-arrow", "left-arrow", "up-arrow", "down-arrow", "user"];

export function detectObjectConnections(predictions: Prediction[], overlapThreshold: number): string {
	// Simplify the detected services into a new array of DetectedObject and give each one a unique id
	const detectedObjects: DetectedObject[] = predictions.map((prediction) => ({
		id: uuidv4(),
		objectType: prediction.tagName,
		generateCode: shouldGenerateCode(prediction.tagName!),
		boundingBox: prediction.boundingBox,
		connectedObjects: []
	}));

	// Iterate through each detected object to see if it overlaps with any other and if it does then add it to the connections array
	for (const detectedObject1 of detectedObjects) {
		for (const detectedOject2 of detectedObjects) {
			// Check that the objects are not the same and if both or neither object are arrows as we don't want to connect arrows or services to each other
			if (
				detectedObject1 !== detectedOject2 &&
				areBothObjectsArrows(detectedObject1, detectedOject2) === false &&
				areBothObjectsServices(detectedObject1, detectedOject2) === false
			) {
				// Check if the bounding boxes overlap
				const connectedObject: Connection = doObjectsOverlap(detectedObject1, detectedOject2, overlapThreshold);

				// If they don't then continue to the next object
				if (connectedObject.connectedToParentOn === Location.None) {
					continue;
				}

				// Check if the connection already exists in the connections array and if not then add it
				if (detectedObject1.connectedObjects.includes(connectedObject) === false) {
					detectedObject1.connectedObjects.push(connectedObject);
				}
			}
		}
	}

	// Remove the bounding box from the services as we don't need it anymore
	const simpleServices = detectedObjects.map(({ id, objectType, generateCode, connectedObjects }) => ({
		id,
		objectType,
		generateCode,
		connectedObjects
	}));

	return JSON.stringify(simpleServices, null, 4);
}

function doObjectsOverlap(detection1: DetectedObject, detection2: DetectedObject, overlapThreshold: number): Connection {
	// Calculate the bounding boxes with the overlap threshold
	const box1 = calcuateBoxWithThreshold(detection1.boundingBox!, overlapThreshold);
	const box2 = calcuateBoxWithThreshold(detection2.boundingBox!, overlapThreshold);

	// Do boxes overlap at all? If not then return
	if (doBoundingBoxesOverlap(box1, box2) === false) {
		return {
			connectedToParentOn: Location.None
		};
	}

	// Determine which object is an arrow and which is a service
	const isDetection1Arrow = detection1.objectType?.endsWith("-arrow") === true;
	const isDetection2Arrow = detection2.objectType?.endsWith("-arrow") === true;

	// Determine the position of the overlaping boxes
	return determineOverlapPosition(
		box1,
		box2,
		isDetection1Arrow ? detection1.objectType! : detection2.objectType!,
		isDetection2Arrow ? "connector" : detection2.objectType!,
		detection2.id
	);
}

function doBoundingBoxesOverlap(box1: BoundingBox, box2: BoundingBox) {
	return !(box1.width < box2.left || box1.left > box2.width || box1.height < box2.top || box1.top > box2.height);
}

function areBothObjectsArrows(service1: DetectedObject, service2: DetectedObject): boolean {
	return service1.objectType?.endsWith("-arrow") === true && service2.objectType?.endsWith("-arrow") === true;
}

function areBothObjectsServices(service1: DetectedObject, service2: DetectedObject): boolean {
	return service1.objectType?.endsWith("-arrow") === false && service2.objectType?.endsWith("-arrow") === false;
}

function calcuateBoxWithThreshold(box: BoundingBox, overlapThreshold: number): BoundingBox {
	const x1 = box.left - overlapThreshold * (box.left / 100);
	const y1 = box.top - overlapThreshold * (box.top / 100);
	const x2 = box.left + box.width + overlapThreshold * ((box.left + box.width) / 100);
	const y2 = box.top + box.height + overlapThreshold * ((box.top + box.height) / 100);

	return { left: x1, top: y1, width: x2, height: y2 };
}

function determineOverlapPosition(box1: BoundingBox, box2: BoundingBox, direction: string, connectedType: string, connectedId: string): Connection {
	const isRight: boolean = direction.startsWith("right");
	const isLeft: boolean = direction.startsWith("left");
	const isUp: boolean = direction.startsWith("up");
	const isDown: boolean = direction.startsWith("down");

	if ((isRight && box1.left > box2.left && box1.left < box2.width) || (isLeft && box2.left > box1.left && box2.left < box1.width)) {
		return { id: connectedId, objectType: connectedType, connectedToParentOn: Location.Left, directionOfDataFlow: isRight ? "right" : "left" };
	}

	if ((isRight && box1.width > box2.left && box1.width < box2.width) || (isLeft && box2.width > box1.left && box2.width < box1.width)) {
		return { id: connectedId, objectType: connectedType, connectedToParentOn: Location.Right, directionOfDataFlow: isRight ? "right" : "left" };
	}

	if ((isUp && box2.top > box1.top && box2.top < box1.height) || (isDown && box1.top > box2.top && box1.top < box2.height)) {
		return { id: connectedId, objectType: connectedType, connectedToParentOn: Location.Above, directionOfDataFlow: isUp ? "up" : "down" };
	}

	if ((isUp && box2.height > box1.top && box2.height < box1.height) || (isDown && box1.height > box2.top && box1.height < box2.height)) {
		return { id: connectedId, objectType: connectedType, connectedToParentOn: Location.Below, directionOfDataFlow: isUp ? "up" : "down" };
	}

	return { connectedToParentOn: Location.None };
}

function shouldGenerateCode(objectType: string): boolean {
	return !codeGenerationExcludeList.includes(objectType);
}
