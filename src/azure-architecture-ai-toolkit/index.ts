import { ToolkitConfig } from "./types/tookit-config"
import { IaCLanguage } from "./enums/iac-language";
import { detectFromDiagram } from "./services/custom-vision";
import { explainServices, generateCode } from "./services/open-ai";

export { ToolkitConfig } from "./types/tookit-config";
export { IaCLanguage } from "./enums/iac-language";

let _config: ToolkitConfig;

export function initialise(config: ToolkitConfig): void {
	_config = config;
}

export async function detectServicesFromDiagram(path: string): Promise<string> {
	return await detectFromDiagram(path, _config);
}

export async function explainDiagram(path: string): Promise<string> {
	const results: string = await detectFromDiagram(path, _config);
	return await explainServices(results, _config);
}

export async function generateCodeFromDiagram(path: string, language: IaCLanguage): Promise<string> {
	const results: string = await detectFromDiagram(path, _config);
	return await generateCode(results, language, _config);
}
