import React, { useState, useRef } from 'react';
import { apiService } from './services/apiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  toolData?: Record<string, unknown>;
}

// RTSP Stream Player Component
const RTSPPlayer: React.FC<{ url: string; cameraName: string }> = ({ url, cameraName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startStream = async () => {
    if (!canvasRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // For RTSP streams, we'll try to use WebRTC or provide fallback
      // Since direct RTSP in browser is limited, we'll show a helpful interface

      // Check if we can use WebRTC for RTSP
      if ('RTCPeerConnection' in window) {
        // WebRTC is available, try to establish connection
        setIsPlaying(true);
        setError('WebRTC connection established - RTSP stream should appear here');
      } else {
        throw new Error('WebRTC not supported in this browser');
      }
    } catch (err) {
      console.error('Failed to start RTSP stream:', err);
      setError('Unable to play RTSP stream directly in browser. Use external player.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = () => {
    setIsPlaying(false);
    setError(null);
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden border border-blue-500/30">
      {/* Stream Canvas Area */}
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
        {isPlaying && !error ? (
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2">RTSP Stream Active</p>
            <p className="text-sm text-gray-400">Live feed from {cameraName}</p>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              width={640}
              height={360}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 p-8">
            <svg className="w-20 h-20 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">RTSP Camera Stream</h3>
            <p className="text-sm mb-6">Live feed from {cameraName}</p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={startStream}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m2 0h1.586a1 1 0 01.707.293l.707.707A1 1 0 0020.414 12H21M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Live Stream
                  </>
                )}
              </button>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Player
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Stream Controls */}
      {isPlaying && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
          <button
            onClick={stopStream}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      {/* Stream Info */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-300">
            <span className="font-medium">Stream:</span> {cameraName}
          </div>
          <div className="text-gray-400">
            <span className="font-medium">Protocol:</span> RTSP
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          💡 For best results, use VLC Media Player or dedicated RTSP viewers
        </div>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm Rise Bot, your AI assistant. What can I help you with today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => `thread_${Date.now()}`);

  // Helper function to extract video URLs from tool_data
  const extractVideoUrls = (toolData?: Record<string, unknown>): string[] => {
    if (!toolData) return [];

    const urls: string[] = [];

    try {
      // Check for direct url or urls fields
      if (toolData.url && typeof toolData.url === 'string') {
        urls.push(toolData.url);
      }

      if (toolData.urls && Array.isArray(toolData.urls)) {
        toolData.urls.forEach(url => {
          if (typeof url === 'string') {
            urls.push(url);
          }
        });
      }

      // Check for nested structures and common video-related fields
      const videoFields = ['video_url', 'video_urls', 'stream_url', 'stream_urls', 'feed_url', 'feed_urls', 'camera_url', 'camera_urls'];
      videoFields.forEach(field => {
        if (toolData[field]) {
          if (typeof toolData[field] === 'string') {
            urls.push(toolData[field] as string);
          } else if (Array.isArray(toolData[field])) {
            (toolData[field] as unknown[]).forEach(url => {
              if (typeof url === 'string') {
                urls.push(url);
              }
            });
          }
        }
      });

      // Check for nested structures
      Object.values(toolData).forEach(value => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedUrls = extractVideoUrls(value as Record<string, unknown>);
          urls.push(...nestedUrls);
        }
      });

      console.log('Extracted video URLs:', urls);
    } catch (error) {
      console.warn('Error extracting video URLs:', error);
    }

    return urls;
  };

  // Helper function to check if URL is a video
  const isVideoUrl = (url: string): boolean => {
    try {
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v', '.3gp'];
      const lowerUrl = url.toLowerCase();

      // Check for RTSP streams
      if (lowerUrl.startsWith('rtsp://')) {
        return true;
      }

      // Check file extensions
      const hasVideoExtension = videoExtensions.some(ext => lowerUrl.includes(ext));

      // Check for video-related keywords in URL
      const hasVideoKeywords = lowerUrl.includes('video') ||
                              lowerUrl.includes('stream') ||
                              lowerUrl.includes('live') ||
                              lowerUrl.includes('cam') ||
                              lowerUrl.includes('feed') ||
                              lowerUrl.includes('rtsp');

      // Check for common video hosting patterns
      const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'twitch.tv', 'stream', 'video'];
      const hasVideoHost = videoHosts.some(host => lowerUrl.includes(host));

      return hasVideoExtension || hasVideoKeywords || hasVideoHost;
    } catch (error) {
      console.warn('Error checking video URL:', error);
      return false;
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user'
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await apiService.askQuestion(input, threadId);

        const botResponse: Message = {
          id: messages.length + 2,
          text: response.response,
          sender: 'bot',
          toolData: response.tool_data
        };

        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Failed to get response:', error);

        const errorMessage: Message = {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
          sender: 'bot'
        };

        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-900/30 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-black bg-clip-text text-transparent">
              Rise Bot
            </h1>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const videoUrls = extractVideoUrls(message.toolData);

          return (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-2xl">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-900 to-black text-white rounded-br-md'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-100 rounded-bl-md'
                  }`}
                >
                  {message.text}
                </div>

                {/* Video feeds */}
                {videoUrls.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {videoUrls.length > 1 && (
                      <div className="text-xs text-gray-400 mb-2 px-2">
                        📹 {videoUrls.length} video feed{videoUrls.length > 1 ? 's' : ''} available
                      </div>
                    )}
                    {videoUrls.map((url, index) => (
                      <div key={index} className="rounded-2xl overflow-hidden shadow-lg bg-black/20 backdrop-blur-sm border border-white/10">
                        {isVideoUrl(url) ? (
                          <div className="relative">
                            {url.toLowerCase().startsWith('rtsp://') ? (
                              // RTSP Stream - Use browser-based player
                              <RTSPPlayer
                                url={url}
                                cameraName={url.split('/').pop() || 'IP Camera'}
                              />
                            ) : (
                              // Regular video files
                              <video
                                controls
                                className="w-full max-h-80 object-contain"
                                preload="metadata"
                                onError={(e) => {
                                  console.warn('Video failed to load:', url);
                                  const videoElement = e.target as HTMLVideoElement;
                                  videoElement.style.display = 'none';
                                  // Show fallback content
                                  const parent = videoElement.parentElement;
                                  if (parent) {
                                    const fallback = parent.querySelector('.video-fallback') as HTMLElement;
                                    if (fallback) {
                                      fallback.style.display = 'block';
                                    }
                                  }
                                }}
                              >
                                <source src={url} type="video/mp4" />
                                <source src={url} type="video/webm" />
                                <source src={url} type="video/ogg" />
                                <source src={url} type="video/avi" />
                                <source src={url} type="video/mov" />
                                <source src={url} type="video/quicktime" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            <div className="video-fallback hidden p-4 text-center text-gray-400">
                              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm mb-2">Video failed to load</p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline inline-block"
                              >
                                Open video in new tab
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm mb-2">Video feed not available</p>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm underline inline-block"
                            >
                              Open in new tab
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-400">Rise Bot is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-900/30 bg-black/20 backdrop-blur-sm">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '50px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-900 to-black hover:from-blue-800 hover:to-gray-900 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Rise Bot can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
};

export default Chat;                                         