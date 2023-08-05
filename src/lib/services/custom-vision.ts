import * as fs from "fs";
import * as PredictionApi from "@azure/cognitiveservices-customvision-prediction";
import * as msRest from "@azure/ms-rest-js";
import { DetectImageResponse } from "@azure/cognitiveservices-customvision-prediction/esm/models";
import { detectObjectConnections } from "../utils/detection-utils";
import { ToolkitConfig } from "../types/tookit-config";

// Detect icons in an image
export async function detectServiceIcons(path: string, config: ToolkitConfig): Promise<string> {
	// Create a predictor client
	const predictorCredentials = new msRest.ApiKeyCredentials({ inHeader: { "prediction-key": config.customVisionPredictionKey } });
	const predictor = new PredictionApi.PredictionAPIClient(predictorCredentials, `https://${config.customVisionPredictionInstance}.cognitiveservices.azure.com`);

	// Read the image
	const diagram: Buffer = fs.readFileSync(path);

	// Detect the icons
	const results: DetectImageResponse = await predictor.detectImage(config.customVisionProjectId, config.customVisionPublishIterationName, diagram);

	if (results === undefined || results.predictions === undefined) {
		return "";
	}

	// Filter out any results that are below the detection threshold
	const filteredResults = results.predictions.filter((predictedResult) => {
		const probability: number = predictedResult.probability! * 100.0;
		if (probability <= config.customVisionDetectionThreshold) {
			return false;
		}
		return true;
	});

	// Return the filtered results
	return detectObjectConnections(filteredResults, config.customVisionOverlapThreshold);
}
