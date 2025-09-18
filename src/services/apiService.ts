const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8070';

export interface ChatRequest {
  thread_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  tool_data?: Record<string, unknown>;
}

export interface ApiError {
  detail: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async askQuestion(message: string, threadId: string = "1"): Promise<ChatResponse> {
    try {
      const requestData: ChatRequest = {
        thread_id: threadId,
        message: message
      };

      const response = await fetch(`${this.baseUrl}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      console.log('API Response:', data); // Debug logging
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Method to test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/docs`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();