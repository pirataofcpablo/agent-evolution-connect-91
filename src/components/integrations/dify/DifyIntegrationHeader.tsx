
import React from 'react';

const DifyIntegrationHeader: React.FC = () => {
  return (
    <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-md mb-6">
      <h3 className="text-lg font-medium text-blue-400 mb-2">Sobre a integração com Dify</h3>
      <p className="text-gray-300">
        Dify é uma plataforma de desenvolvimento de aplicativos de IA conversacional que permite criar bots 
        inteligentes e personalizados. Com esta integração, você pode conectar seu WhatsApp a um bot Dify 
        e automatizar conversas e tarefas.
      </p>
    </div>
  );
};

export default DifyIntegrationHeader;
