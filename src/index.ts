import dotenv from "dotenv";
import * as toolkit from "./lib/azure-architecture-ai-toolkit";

// Set the path for the image
const path = "/home/ira/src/azure-architecture-ai-toolkit/images/sample-001.png";

// Configure dotenv
dotenv.config();

// Initialise the toolkit
toolkit.initialise({
	openAIApiKey: process.env.OPEN_AI_API_KEY!,
	openAIInstance: process.env.OPEN_AI_INSTANCE!,
	openAIApiVersion: process.env.OPEN_AI_API_VERSION!,
	openAIDeployment: process.env.OPEN_AI_DEPLOYMENT!,
	customVisionPredictionKey: process.env.CUSTOM_VISION_PREDICTION_KEY!,
	customVisionPredictionInstance: process.env.CUSTOM_VISION_PREDICTION_INSTANCE!,
	customVisionPublishIterationName: process.env.CUSTOM_VISION_PUBLISH_ITERATION_NAME!,
	customVisionProjectId: process.env.CUSTOM_VISION_PROJECT_ID!,
	customVisionDetectionThreshold: 35,
	customVisionOverlapThreshold: 3
});

// Detect services in diagram
Promise.resolve(toolkit.detectServicesFromDiagram(path)).then((results) => {
	console.log("\n///////////////////////////////////\n// Detection\n///////////////////////////////////\n");
	console.log(results);
});

// Explain diagram
Promise.resolve(toolkit.explainDiagram(path)).then((results) => {
	console.log("\n///////////////////////////////////\n// Explanation\n///////////////////////////////////\n");
	console.log(results);
});

// Generate code from diagram
Promise.resolve(toolkit.generateCodeFromDiagram(path, toolkit.IaCLanguage.Terraform)).then((results) => {
	console.log("\n///////////////////////////////////\n// Generation\n///////////////////////////////////\n");
	console.log(results);
});
