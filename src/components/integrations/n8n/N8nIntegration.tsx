
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { 
  getN8nConfig,
  checkN8nFlowExists
} from '@/services/n8nService';
import N8nIntegrationHeader from './N8nIntegrationHeader';
import N8nTabs from './N8nTabs';

interface N8nIntegrationProps {
  instanceName: string;
}

const N8nIntegration: React.FC<N8nIntegrationProps> = ({ instanceName }) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [n8nUrl, setN8nUrl] = useState("");
  const [enableWebhook, setEnableWebhook] = useState(true);
  const [enableApi, setEnableApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("config");
  
  // AI Model integration
  const [selectedAiModel, setSelectedAiModel] = useState<'groq' | 'openai' | null>(null);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [openAiApiKey, setOpenAiApiKey] = useState("");
  const [isAiConfiguring, setIsAiConfiguring] = useState(false);
  const [flowExists, setFlowExists] = useState(false);
  const [checkingFlow, setCheckingFlow] = useState(true);

  // Carregar configuração se existir
  useEffect(() => {
    const savedConfig = getN8nConfig(instanceName);
    if (savedConfig) {
      setWebhookUrl(savedConfig.webhookUrl || "");
      setApiKey(savedConfig.apiKey || "");
      setN8nUrl(savedConfig.n8nUrl || "");
      setEnableWebhook(savedConfig.enableWebhook);
      setEnableApi(savedConfig.enableApi);
      setSelectedAiModel(savedConfig.aiModel || null);
      
      if (savedConfig.aiApiKey) {
        if (savedConfig.aiModel === 'groq') {
          setGroqApiKey(savedConfig.aiApiKey);
        } else if (savedConfig.aiModel === 'openai') {
          setOpenAiApiKey(savedConfig.aiApiKey);
        }
      }
    }
    
    // Verificar se já existe um fluxo para esta instância
    checkN8nFlowExists(instanceName).then(exists => {
      setFlowExists(exists);
      setCheckingFlow(false);
    }).catch(error => {
      console.error("Erro ao verificar existência de fluxo:", error);
      setCheckingFlow(false);
    });
  }, [instanceName]);

  return (
    <div className="space-y-6">
      <N8nIntegrationHeader />
      
      <N8nTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        selectedAiModel={selectedAiModel}
        setSelectedAiModel={setSelectedAiModel}
        groqApiKey={groqApiKey}
        setGroqApiKey={setGroqApiKey}
        openAiApiKey={openAiApiKey}
        setOpenAiApiKey={setOpenAiApiKey}
        isAiConfiguring={isAiConfiguring}
        setIsAiConfiguring={setIsAiConfiguring}
        flowExists={flowExists}
        setFlowExists={setFlowExists}
        checkingFlow={checkingFlow}
      />
    </div>
  );
};

export default N8nIntegration;
