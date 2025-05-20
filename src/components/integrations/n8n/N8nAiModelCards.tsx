
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface N8nAiModelCardsProps {
  selectedAiModel: 'groq' | 'openai' | null;
  groqApiKey: string;
  setGroqApiKey: React.Dispatch<React.SetStateAction<string>>;
  openAiApiKey: string;
  setOpenAiApiKey: React.Dispatch<React.SetStateAction<string>>;
  isAiConfiguring: boolean;
  onSaveGroq: () => void;
  onSaveOpenAi: () => void;
}

const N8nAiModelCards: React.FC<N8nAiModelCardsProps> = ({
  selectedAiModel,
  groqApiKey,
  setGroqApiKey,
  openAiApiKey,
  setOpenAiApiKey,
  isAiConfiguring,
  onSaveGroq,
  onSaveOpenAi
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Groq Integration Card */}
      <Card className={`bg-gray-900 border-gray-800 ${selectedAiModel === 'groq' ? 'ring-2 ring-green-500' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">🧠</span>
            Groq LLM
            {selectedAiModel === 'groq' && <Check className="ml-2 h-5 w-5 text-green-500" />}
          </CardTitle>
          <CardDescription>
            Groq é um modelo de linguagem rápido com baixa latência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groq-api-key">API Key da Groq</Label>
            <Input
              id="groq-api-key"
              type="password"
              placeholder="Insira sua API Key da Groq"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">
              Obtenha sua API key em{" "}
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                console.groq.com
              </a>
            </p>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={onSaveGroq}
              disabled={isAiConfiguring || !groqApiKey}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isAiConfiguring && selectedAiModel === 'groq' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configurando...
                </>
              ) : (
                selectedAiModel === 'groq' ? "Atualizar Configuração" : "Usar Groq LLM"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* OpenAI Integration Card */}
      <Card className={`bg-gray-900 border-gray-800 ${selectedAiModel === 'openai' ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            OpenAI GPT
            {selectedAiModel === 'openai' && <Check className="ml-2 h-5 w-5 text-blue-500" />}
          </CardTitle>
          <CardDescription>
            Modelos GPT da OpenAI como o GPT-4o com alta qualidade de resposta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-api-key">API Key da OpenAI</Label>
            <Input
              id="openai-api-key"
              type="password"
              placeholder="Insira sua API Key da OpenAI"
              value={openAiApiKey}
              onChange={(e) => setOpenAiApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">
              Obtenha sua API key em{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                platform.openai.com
              </a>
            </p>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={onSaveOpenAi}
              disabled={isAiConfiguring || !openAiApiKey}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAiConfiguring && selectedAiModel === 'openai' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configurando...
                </>
              ) : (
                selectedAiModel === 'openai' ? "Atualizar Configuração" : "Usar OpenAI GPT"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nAiModelCards;
