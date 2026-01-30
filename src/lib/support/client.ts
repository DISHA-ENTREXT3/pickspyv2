const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const supportClient = {
  submitTicket: async (data: {
    product: string;
    category: string;
    user_email: string;
    message: string;
    metadata?: Record<string, unknown>;
  }) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Support Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to submit support ticket:', error);
      throw error;
    }
  }
};
