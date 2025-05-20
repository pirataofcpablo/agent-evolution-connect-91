
import React from 'react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateN8nFlowAiModel, getN8nConfig, saveN8nConfig } from '@/services/n8nService';
import N8nAiModelCards from './N8nAiModelCards';

interface N8nAiTabProps {
  instanceName: string;
  flowExists: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  selectedAiModel: 'groq' | 'openai' | null;
  setSelectedAiModel: React.Dispatch<React.SetStateAction<'groq' | 'openai' | null>>;
  groqApiKey: string;
  setGroqApiKey: React.Dispatch<React.SetStateAction<string>>;
  openAiApiKey: string;
  setOpenAiApiKey: React.Dispatch<React.SetStateAction<string>>;
  isAiConfiguring: boolean;
  setIsAiConfiguring: React.Dispatch<React.SetStateAction<boolean>>;
}

const N8nAiTab: React.FC<N8nAiTabProps> = ({
  instanceName,
  flowExists,
  setActiveTab,
  selectedAiModel,
  setSelectedAiModel,
  groqApiKey,
  setGroqApiKey,
  openAiApiKey,
  setOpenAiApiKey,
  isAiConfiguring,
  setIsAiConfiguring
}) => {
  const handleSaveAiConfig = async (model: 'groq' | 'openai') => {
    setIsAiConfiguring(true);
    
    const apiKey = model === 'groq' ? groqApiKey : openAiApiKey;
    
    if (!apiKey) {
      toast({
        title: "API Key obrigatória",
        description: `Por favor, insira sua API Key do ${model === 'groq' ? 'Groq' : 'OpenAI'}`,
        variant: "destructive",
      });
      setIsAiConfiguring(false);
      return;
    }
    
    try {
      const success = await updateN8nFlowAiModel(instanceName, model, apiKey);
      
      if (success) {
        setSelectedAiModel(model);
        
        toast({
          title: "Modelo configurado",
          description: `Seu agente agora está usando ${model === 'groq' ? 'Groq LLM' : 'OpenAI GPT'}`,
        });
        
        // Salvar a configuração atualizada
        const currentConfig = getN8nConfig(instanceName) || {
          webhookUrl: "",
          apiKey: "",
          n8nUrl: "",
          enableWebhook: true,
          enableApi: false
        };
        
        saveN8nConfig(instanceName, {
          ...currentConfig,
          aiModel: model,
          aiApiKey: apiKey
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível configurar o modelo de IA no fluxo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao configurar modelo de IA:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao configurar o modelo de IA.",
        variant: "destructive",
      });
    } finally {
      setIsAiConfiguring(false);
    }
  };

  if (!flowExists) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Fluxo n8n não configurado</h3>
        <p className="text-gray-400 mb-4">
          Você precisa criar um fluxo n8n primeiro antes de configurar seu agente IA.
          Volte para a aba "Configuração Básica" e clique em "Criar Fluxo Automático".
        </p>
        <Button 
          onClick={() => setActiveTab("config")}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Voltar para Configuração Básica
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <N8nAiModelCards 
        selectedAiModel={selectedAiModel}
        groqApiKey={groqApiKey}
        setGroqApiKey={setGroqApiKey}
        openAiApiKey={openAiApiKey}
        setOpenAiApiKey={setOpenAiApiKey}
        isAiConfiguring={isAiConfiguring}
        onSaveGroq={() => handleSaveAiConfig('groq')}
        onSaveOpenAi={() => handleSaveAiConfig('openai')}
      />
      
      {selectedAiModel && (
        <Alert className="bg-green-900/20 border-green-500/30">
          <Check className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-500">Agente IA Configurado</AlertTitle>
          <AlertDescription className="text-gray-300">
            Seu agente está usando {selectedAiModel === 'groq' ? 'Groq LLM' : 'OpenAI GPT'}.
            Acesse a página "Personalidade IA" para enviar conhecimento para seu agente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default N8nAiTab;
