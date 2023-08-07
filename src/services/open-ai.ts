import axios from "axios";
import { DetectedObject } from "../types/detected-object";
import { IaCLanguage } from "../enums/iac-language";
import { ToolkitConfig } from "../types/tookit-config";

// Explain the services found in the diagram
export async function explainServices(services: string, config: ToolkitConfig): Promise<string> {
	// Configure AXIOS client
	configureAxios(config);

	// Filter out the response to only include the service names
	const filteredServices = JSON.stringify(services);

	// Call the OpenAI API to generate the explanation
	const result = await axios.post(`/completions?api-version=${config.openAIApiVersion}`, {
		temperature: 0.1,
		messages: [
			{
				role: "system",
				content: `• Act as an assistant that analyses an Azure architecture diagram as detailed in the following JSON array to enable you to describe it to a stakeholder.
						• "connectedToParentOn" - This property determines where the connected object is located on the diagram in relation to the parent object.
						• "directionOfDataFlow" - This property determines the direction of the data flow between the two services.
						• "objectType" - This property determines the type of Azure service or a connector that connects two services as defined within the "connectedObjects" array.
						• Do not mention the JSON array in the explanation.
						• Do not include rectangles in the response.
						• Do not include Azure services that are not listed array in the response.
						• JSON ###\n${filteredServices}\n###`
			},
			{
				role: "user",
				content: "Describe the architecture diagram using plain English."
			}
		]
	});

	// Return the explanation
	return result.data.choices[0].message.content;
}

// Generate infrastructure as code for the services found in the diagram
export async function generateCode(services: string, language: IaCLanguage, config: ToolkitConfig): Promise<string> {
	// Configure AXIOS client
	configureAxios(config);

	// Convert our JSON string back to an array of DetectedObject
	const servicesCollection: DetectedObject[] = JSON.parse(services);

	// Filter out the response to only include the services that we want to generate code for
	const servicesOnly = servicesCollection.filter((item) => item.generateCode === true);

	// Then filter out the response to only include the service names
	const filteredServices = JSON.stringify(servicesOnly.map((item) => item.objectType));

	// Call the OpenAI API to generate the code
	const result = await axios.post(`/completions?api-version=${config.openAIApiVersion}`, {
		temperature: 0.1,
		messages: [
			{
				role: "system",
				content: `• Act as an assistant that generates infrastructure as code for the Azure services detailed in the following JSON array
						• Always use the latest version of the provider for the language specified. 
						• Do not include any services that are not listed. 
						• Do not include any code that is not the specified language.
						• Do not include anything that isn't code in the output.
						• JSON ###\n${filteredServices}\n###`
						},
			{
				role: "user",
				content: `Generate a code file for the services ing ${language}`
			}
		]
	});

	// Return the code
	return result.data.choices[0].message.content;
}

// Configure AXIOS client
function configureAxios(config: ToolkitConfig) {
	axios.defaults.baseURL = `https://${config.openAIInstance}.openai.azure.com/openai/deployments/${config.openAIDeployment}/chat`;
	axios.defaults.headers.common["api-key"] = config.openAIApiKey!;
	axios.defaults.headers.post["Content-Type"] = "application/json";
}
