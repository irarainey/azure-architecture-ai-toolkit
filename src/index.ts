import dotenv from "dotenv";
import * as toolkit from "./azure-architecture-ai-toolkit/index";

// Set the path for the image
const localPath = "/home/ira/src/azure-architecture-ai-toolkit/assets/architecture-samples/sample-001.png";
const remotePath = "https://raw.githubusercontent.com/irarainey/azure-architecture-ai-toolkit/d1a65d3a31c2eaf31d040531334d6a224654b71f/assets/architecture-samples/sample-001.png";

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
Promise.resolve(toolkit.detectServicesFromDiagram(localPath)).then((results) => {
	console.log("\n///////////////////////////////////\n// Detection\n///////////////////////////////////\n");
	console.log(results);
});

// Explain diagram
Promise.resolve(toolkit.explainDiagram(localPath)).then((results) => {
	console.log("\n///////////////////////////////////\n// Explanation\n///////////////////////////////////\n");
	console.log(results);
});

// Generate code from diagram
Promise.resolve(toolkit.generateCodeFromDiagram(localPath, toolkit.IaCLanguage.Terraform)).then((results) => {
	console.log("\n///////////////////////////////////\n// Generation\n///////////////////////////////////\n");
	console.log(results);
});
