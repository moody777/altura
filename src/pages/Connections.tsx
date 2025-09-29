import React from 'react';
import { MessageCircle, Clock, Zap } from 'lucide-react';

const Connections: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
            <MessageCircle className="w-10 h-10" />
        </div>

          <h1 className="text-4xl font-bold text-white mb-4">Connections & Messages</h1>
          <p className="text-xl text-gray-300 mb-8">
            Coming in V1
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
            <Clock className="w-5 h-5" />
            <span>This feature is currently in development</span>
          </div>

          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-[#B8860B]" />
              <h3 className="text-lg font-semibold text-white">What's Coming</h3>
            </div>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#B8860B] rounded-full"></div>
                <span>Professional networking and connections</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#B8860B] rounded-full"></div>
                <span>Real-time messaging system</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#B8860B] rounded-full"></div>
                <span>Connection requests and management</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#B8860B] rounded-full"></div>
                <span>Message history and search</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;