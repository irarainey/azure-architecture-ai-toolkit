import axios from "axios";
import { OpenAIConfig } from "../types/openai-config";

export class AzureArchitectureAIToolkit {
	private openAIConfig: OpenAIConfig;

	public constructor(config: OpenAIConfig) {
		this.openAIConfig = config;
		axios.defaults.baseURL = `https://${config.instance}.openai.azure.com/openai/deployments/${config.deployment}/chat`;
		axios.defaults.headers.common["api-key"] = config.apiKey!;
		axios.defaults.headers.post["Content-Type"] = "application/json";
	}
}