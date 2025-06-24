

/**
 * Ultra-focused HTTP request executor.
 * Only responsibility: Take a request config and return the response.
 * No routes, no storage, no magic - just execution.
 */
class HttpClient {
    /**
   * Execute an HTTP request
   * @param config - Pure request configuration
   * @returns Raw response from server
   * @example
   * // type AuthenticationResponse = {
    //     success: boolean;
    //     message: string;
    //     data?: {
    //         firstname: string;
    //         lastname: string;
    //         birthdate: string;
    //         email: string;
    //     };
    //     error?: {
    //         code: string;
    //         message: string;
    //     };
    //     tokens?: {
    //         accesstoken?: string;
    //         refreshtoken?: string;
    //     };
    // };

   * // Usage example:
    const client = new HttpClient();

    // Signup request
    const signupResponse = await client.execute<AuthenticationResponse>({
    url: 'http://localhost:3000/signup',
    method: 'POST',
    body: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'secure123',
    },
    });

    // Signin request  
    const signinResponse = await client.execute<AuthenticationResponse>({
    url: 'http://localhost:3000/signin',
    method: 'POST',
    body: {
        email: 'john@example.com',
        password: 'secure123',
    },
    });
   */
    async execute<T>(config: { url: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; headers?: Record<string, string>; body?: any }): Promise<{
        status: number;
        data: T;
        headers: Headers;
    }> {
        const response = await fetch(config.url, {
            method: config.method,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
            body: config.body ? JSON.stringify(config.body) : undefined,
        });

        return {
            status: response.status,
            data: await response.json(),
            headers: response.headers,
        };
    }
}
export default HttpClient;