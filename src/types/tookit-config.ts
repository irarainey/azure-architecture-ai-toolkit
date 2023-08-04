export interface ToolkitConfig {
	// OpenAI
	openAIApiKey: string;
	openAIInstance: string;
	openAIApiVersion: string;
	openAIDeployment: string;
	// Custom Vision
	customVisionPredictionKey: string;
	customVisionPredictionInstance: string;
	customVisionPublishIterationName: string;
	customVisionProjectId: string;
	customVisionDetectionThreshold: number;
	customVisionOverlapThreshold: number;
}