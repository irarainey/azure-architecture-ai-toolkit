import dotenv from "dotenv";
import { AzureArchitectureAIToolkit } from "./lib";
import { IaCLanguage } from "./enums/iac-language";

// Export the main library
//export { AzureArchitectureAIToolkit } from "./lib";

// Export the types
//export type { ToolkitConfig as OpenAIConfig } from "./types/tookit-config";

dotenv.config();

export async function main(path: string) {
	const toolkit = new AzureArchitectureAIToolkit({
		openAIApiKey: process.env.OPEN_AI_API_KEY!,
		openAIInstance: process.env.OPEN_AI_INSTANCE!,
		openAIApiVersion: process.env.OPEN_AI_API_VERSION!,
		openAIDeployment: process.env.OPEN_AI_DEPLOYMENT!,
		customVisionPredictionKey: process.env.CUSTOM_VISION_PREDICTION_KEY!,
		customVisionPredictionInstance: process.env.CUSTOM_VISION_PREDICTION_INSTANCE!,
		customVisionPublishIterationName: process.env.CUSTOM_VISION_PROJECT_ID!,
		customVisionProjectId: process.env.CUSTOM_VISION_PUBLISH_ITERATION_NAME!,
		customVisionDetectionThreshold: 35,
		customVisionOverlapThreshold: 3
	});

    //const results = await toolkit.detectServicesFromFile(path);
    //const results = await toolkit.explainDiagram(path);
    const results = await toolkit.generateCodeFromDiagram(path, IaCLanguage.Terraform);

    console.log(results);
}
