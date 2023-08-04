/* eslint-disable @typescript-eslint/naming-convention */
import * as fs from "fs";
import * as PredictionApi from "@azure/cognitiveservices-customvision-prediction";
import * as msRest from "@azure/ms-rest-js";
import { DetectImageResponse } from "@azure/cognitiveservices-customvision-prediction/esm/models";
import { detectObjectConnections } from "../utils/detection-utils";

// Detect icons in an image
export async function detectServiceIcons(path: string): Promise<string> {
	// Get all configuration settings
	const predictionKey: string = "";
	const predictionInstance: string = "";
	const publishIterationName: string = "";
	const projectId: string = "";
	const detectionThreshold: number = 35;

	// Create a predictor client
	const predictorCredentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
	const predictor = new PredictionApi.PredictionAPIClient(predictorCredentials, `https://${predictionInstance}.cognitiveservices.azure.com`);

	// Read the image
	const diagram: Buffer = fs.readFileSync(path);

	// Detect the icons
	const results: DetectImageResponse = await predictor.detectImage(projectId, publishIterationName, diagram);

	if (results === undefined || results.predictions === undefined) {
		return "";
	}

	// Filter out any results that are below the detection threshold
	const filteredResults = results.predictions.filter((predictedResult) => {
		const probability: number = predictedResult.probability! * 100.0;
		if (probability <= detectionThreshold) {
			return false;
		}
		return true;
	});

	// Return the filtered results
	return detectObjectConnections(filteredResults);
}
