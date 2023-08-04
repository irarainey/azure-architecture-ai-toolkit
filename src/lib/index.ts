import axios from "axios";
import { ToolkitConfig } from "../types/tookit-config";
import { IaCLanguage } from "../enums/iac-language";
import { detectServiceIcons } from "../services/custom-vision";
import { explainServices, generateCode } from "../services/open-ai";

export class AzureArchitectureAIToolkit {
	private config: ToolkitConfig;

	public constructor(config: ToolkitConfig) {
		this.config = config;
		axios.defaults.baseURL = `https://${config.openAIInstance}.openai.azure.com/openai/deployments/${config.openAIDeployment}/chat`;
		axios.defaults.headers.common["api-key"] = config.openAIApiKey!;
		axios.defaults.headers.post["Content-Type"] = "application/json";
	}

	public async detectServicesFromFile(path: string): Promise<string> {
		return await detectServiceIcons(path);
	}

	public async explainDiagram(path: string): Promise<string> {
		const results: string = await this.detectServicesFromFile(path);
		return await explainServices(results);
	}
	
	public async generateCodeFromDiagram(path: string, language: IaCLanguage): Promise<string> {
		const results: string = await this.detectServicesFromFile(path);
		return await generateCode(results, language);
	}
}