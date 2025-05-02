class ApiError extends Error {
  public statusCode: number;
  public endpoint: string;

  constructor(message: string, statusCode: number, endpoint: string) {
    super(message);
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.name = 'ApiError';
  }
}

async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any = null,
  retries: number = 0,
  delay: number = 1000,
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error: ${response.status} ${response.statusText}`,
          response.status,
          endpoint,
        );
      }

      const content = await response.json();
      return content as T;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      console.warn(
        `Attempt ${attempt + 1} failed: ${(error as Error).message}. Retrying in ${delay}ms...`,
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new ApiError('Max retries reached', 500, endpoint);
}

export default apiCall;
export { ApiError };
