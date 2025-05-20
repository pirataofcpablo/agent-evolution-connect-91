
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import N8nConfigTab from './N8nConfigTab';
import N8nAiTab from './N8nAiTab';

interface N8nTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  instanceName: string;
  webhookUrl: string;
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  n8nUrl: string;
  setN8nUrl: React.Dispatch<React.SetStateAction<string>>;
  enableWebhook: boolean;
  setEnableWebhook: React.Dispatch<React.SetStateAction<boolean>>;
  enableApi: boolean;
  setEnableApi: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAiModel: 'groq' | 'openai' | null;
  setSelectedAiModel: React.Dispatch<React.SetStateAction<'groq' | 'openai' | null>>;
  groqApiKey: string;
  setGroqApiKey: React.Dispatch<React.SetStateAction<string>>;
  openAiApiKey: string;
  setOpenAiApiKey: React.Dispatch<React.SetStateAction<string>>;
  isAiConfiguring: boolean;
  setIsAiConfiguring: React.Dispatch<React.SetStateAction<boolean>>;
  flowExists: boolean;
  setFlowExists: React.Dispatch<React.SetStateAction<boolean>>;
  checkingFlow: boolean;
}

const N8nTabs: React.FC<N8nTabsProps> = ({
  activeTab,
  setActiveTab,
  instanceName,
  webhookUrl,
  setWebhookUrl,
  apiKey,
  setApiKey,
  n8nUrl,
  setN8nUrl,
  enableWebhook,
  setEnableWebhook,
  enableApi,
  setEnableApi,
  isLoading,
  setIsLoading,
  selectedAiModel,
  setSelectedAiModel,
  groqApiKey,
  setGroqApiKey,
  openAiApiKey,
  setOpenAiApiKey,
  isAiConfiguring,
  setIsAiConfiguring,
  flowExists,
  setFlowExists,
  checkingFlow,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="config">Configuração Básica</TabsTrigger>
        <TabsTrigger value="ai">Agente IA</TabsTrigger>
      </TabsList>
      
      <TabsContent value="config">
        <N8nConfigTab
          instanceName={instanceName}
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
          apiKey={apiKey}
          setApiKey={setApiKey}
          n8nUrl={n8nUrl}
          setN8nUrl={setN8nUrl}
          enableWebhook={enableWebhook}
          setEnableWebhook={setEnableWebhook}
          enableApi={enableApi}
          setEnableApi={setEnableApi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          flowExists={flowExists}
          setFlowExists={setFlowExists}
          checkingFlow={checkingFlow}
        />
      </TabsContent>
      
      <TabsContent value="ai">
        <N8nAiTab
          instanceName={instanceName}
          flowExists={flowExists}
          setActiveTab={setActiveTab}
          selectedAiModel={selectedAiModel}
          setSelectedAiModel={setSelectedAiModel}
          groqApiKey={groqApiKey}
          setGroqApiKey={setGroqApiKey}
          openAiApiKey={openAiApiKey}
          setOpenAiApiKey={setOpenAiApiKey}
          isAiConfiguring={isAiConfiguring}
          setIsAiConfiguring={setIsAiConfiguring}
        />
      </TabsContent>
    </Tabs>
  );
};

export default N8nTabs;
