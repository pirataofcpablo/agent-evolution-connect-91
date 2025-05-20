
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Headphones, Package, Handshake, TestTube } from "lucide-react";
import { sendWhatsAppMessage } from '@/services/webhookService';
import { useEvoInstance } from '@/hooks/useEvoInstance';

interface ButtonOption {
  id: number;
  text: string;
  icon: React.ReactNode;
  flow: string;
}

const ButtonChatbot: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<ButtonOption | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'bot' | 'user', message: string}[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const { instanceName } = useEvoInstance();
  const [recipientNumber, setRecipientNumber] = useState('');

  const buttonOptions: ButtonOption[] = [
    { 
      id: 1, 
      text: "Renovação", 
      icon: <RefreshCw />,
      flow: "Entendido! Para realizar sua renovação, precisamos confirmar alguns dados:\n\n1. Qual o nome completo do titular?\n2. Qual o serviço que você deseja renovar?"
    },
    { 
      id: 2, 
      text: "Suporte Humanizado", 
      icon: <Headphones />,
      flow: "Estamos encaminhando você para um atendente real. Por favor, descreva brevemente o que você precisa de ajuda."
    },
    { 
      id: 3, 
      text: "Produtos e Serviços", 
      icon: <Package />,
      flow: "Ótimo! Temos diversos produtos e serviços disponíveis. Qual área é do seu interesse?\n\n1. Comunicação\n2. Marketing\n3. Automação\n4. Integrações\n5. Treinamentos"
    },
    { 
      id: 4, 
      text: "Quero ser Revendedor", 
      icon: <Handshake />,
      flow: "Que excelente escolha! Para se tornar um revendedor, precisamos de algumas informações:\n\n1. Qual seu nome completo?\n2. Nome da sua empresa (se houver)\n3. Seu e-mail para contato"
    },
    { 
      id: 5, 
      text: "Quero fazer um Teste", 
      icon: <TestTube />,
      flow: "Claro! Oferecemos um período de teste gratuito de 7 dias. Para configurarmos seu acesso:\n\n1. Qual seu nome completo?\n2. E-mail para envio das credenciais?\n3. Telefone para contato"
    }
  ];

  // Inicializar o chat com uma mensagem de boas-vindas
  useEffect(() => {
    setChatHistory([
      {
        type: 'bot',
        message: "Olá! Bem-vindo ao nosso atendimento virtual. Como posso ajudar você hoje? Escolha uma das opções abaixo:"
      }
    ]);
  }, []);

  const handleOptionClick = async (option: ButtonOption) => {
    if (!recipientNumber) {
      alert('Por favor, insira o número do destinatário primeiro.');
      return;
    }

    // Adicionar a seleção do usuário ao histórico
    setChatHistory(prev => [
      ...prev, 
      { type: 'user', message: `Selecionado: ${option.text}` },
      { type: 'bot', message: option.flow }
    ]);
    
    setSelectedOption(option);

    // Enviar a mensagem pelo WhatsApp se uma instância estiver conectada
    if (instanceName) {
      try {
        setIsWaitingForResponse(true);
        const normalizedNumber = recipientNumber.replace(/\D/g, '');
        await sendWhatsAppMessage(
          instanceName, 
          normalizedNumber, 
          `${option.flow}`
        );
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      } finally {
        setIsWaitingForResponse(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !recipientNumber || !instanceName) return;

    // Adicionar a mensagem do usuário ao histórico
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    
    const currentMessage = userMessage;
    setUserMessage('');
    
    // Enviar a mensagem pelo WhatsApp
    try {
      setIsWaitingForResponse(true);
      const normalizedNumber = recipientNumber.replace(/\D/g, '');
      await sendWhatsAppMessage(instanceName, normalizedNumber, currentMessage);
      
      // Simular uma resposta automática baseada no contexto atual
      setTimeout(() => {
        let botResponse = "Recebemos sua mensagem. Um agente entrará em contato em breve.";
        
        if (selectedOption?.id === 1) {
          botResponse = "Obrigado pelas informações de renovação. Estamos processando seu pedido e enviaremos a confirmação em breve.";
        } else if (selectedOption?.id === 5) {
          botResponse = "Obrigado pelo interesse em testar nossos serviços! Suas credenciais de teste serão enviadas em instantes.";
        }
        
        setChatHistory(prev => [...prev, { type: 'bot', message: botResponse }]);
        setIsWaitingForResponse(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsWaitingForResponse(false);
    }
  };

  return (
    <Card className="border-blue-500/20 bg-black max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-blue-400">Chatbot de Botões</CardTitle>
        <CardDescription className="text-gray-400">
          Sistema de atendimento automatizado com opções pré-definidas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Número do destinatário */}
        <div className="mb-4">
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
            Número do WhatsApp (com DDD)
          </label>
          <Input 
            type="text" 
            id="recipient" 
            placeholder="Ex: 5511999999999" 
            className="bg-gray-800 border-gray-700 text-white" 
            value={recipientNumber}
            onChange={(e) => setRecipientNumber(e.target.value)}
          />
        </div>
        
        {/* Área de conversa */}
        <div className="bg-gray-900 rounded-md p-4 h-80 overflow-y-auto space-y-3">
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`${
                chat.type === 'bot' 
                  ? 'bg-blue-900/30 text-gray-200' 
                  : 'bg-green-900/30 text-white ml-auto'
              } p-3 rounded-md max-w-[80%] break-words`}
            >
              {chat.message}
            </div>
          ))}
          {isWaitingForResponse && (
            <div className="bg-gray-800 text-gray-400 p-2 rounded-md w-16">
              Digitando...
            </div>
          )}
        </div>
        
        {/* Opções de botões */}
        <div className="grid grid-cols-2 gap-2">
          {buttonOptions.map(option => (
            <Button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center"
              disabled={isWaitingForResponse}
            >
              {option.icon}
              <span className="ml-2">{option.text}</span>
            </Button>
          ))}
        </div>
        
        {/* Área de entrada de texto */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Digite sua mensagem..."
            className="bg-gray-800 border-gray-700 text-white"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isWaitingForResponse || !userMessage.trim()}
          >
            Enviar
          </Button>
        </div>
        
        {!instanceName && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3 text-red-400 text-sm">
            Nenhuma instância conectada! Conecte-se à Evolution API antes de usar o chatbot.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ButtonChatbot;
