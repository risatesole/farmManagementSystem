export type UserCredentials = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  agreedTermsOfService: boolean;
};

type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: {
    firstname: string;
    lastname: string;
    birthdate: string;
    username: string;
  };
  tokens?: {
    accesstoken?: string;
    refreshtoken?: string;
  };
  error?: {
    code: string;
    message: string;
  };
};

export class AuthService {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<AuthTokens | null> | null = null;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  private async fetchJSON(input: RequestInfo, init?: RequestInit): Promise<any> {
    const response = await fetch(input, init);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        data: errorData,
      };
    }
    return response.json();
  }

  private saveTokens(tokens: { accesstoken?: string; refreshtoken?: string }): void {
    if (tokens.accesstoken) {
      this.accessToken = tokens.accesstoken;
    }
    if (tokens.refreshtoken) {
      this.refreshToken = tokens.refreshtoken;
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  private async authenticatedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const headers = new Headers(init?.headers);
    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    let response = await fetch(input, {
      ...init,
      headers,
    });

    if (response.status === 401 && this.refreshToken) {
      try {
        const tokens = await this.refreshAccessToken();
        if (tokens?.accessToken) {
          headers.set('Authorization', `Bearer ${tokens.accessToken}`);
          return fetch(input, {
            ...init,
            headers,
          });
        }
      } catch (refreshError) {
        this.clearTokens();
        throw refreshError;
      }
    }

    return response;
  }

  public async signUp(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchJSON(`${this.baseURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: credentials.firstname,
          lastname: credentials.lastname,
          username: credentials.username,
          password: credentials.password,
          birthdate: credentials.birthdate,
          agreedTermsOfService: credentials.agreedTermsOfService
        }),
      });

      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || 'Signup failed',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public async signIn(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.fetchJSON(`${this.baseURL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.success && response.tokens) {
        this.saveTokens(response.tokens);
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || 'Login failed',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public async signOut(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      this.clearTokens();
      return {
        success: true,
        message: 'No active session',
      };
    }

    try {
      const response = await this.fetchJSON(`${this.baseURL}/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.refreshToken}`,
        },
      });

      this.clearTokens();
      return response;
    } catch (error: any) {
      this.clearTokens();
      return {
        success: false,
        message: error.data?.message || 'Logout failed',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public async refreshAccessToken(): Promise<AuthTokens | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      return null;
    }

    try {
      this.refreshPromise = (async () => {
        const response = await fetch(`${this.baseURL}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.refreshToken}`,
          },
        });

        if (!response.ok) {
          throw await response.json().catch(() => ({}));
        }

        const data = await response.json();

        if (data.success && data.tokens?.accesstoken) {
          const tokens = {
            accessToken: data.tokens.accesstoken,
            refreshToken: this.refreshToken!,
          };
          this.saveTokens({
            accesstoken: tokens.accessToken,
            refreshtoken: tokens.refreshToken,
          });
          return tokens;
        }
        return null;
      })();

      const result = await this.refreshPromise;
      return result;
    } catch (error) {
      this.clearTokens();
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  public async getPrivateData(): Promise<any> {
    try {
      const response = await this.authenticatedFetch(`${this.baseURL}/private`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error: any) {
      throw {
        success: false,
        message: error.data?.message || 'Failed to fetch private data',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public async resetPassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await this.authenticatedFetch(`${this.baseURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || 'Password reset failed',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public async changeUsername(newUsername: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.authenticatedFetch(`${this.baseURL}/change-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newUsername,
          password,
        }),
      });
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || 'Username change failed',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public async deleteAccount(password: string): Promise<AuthResponse> {
    try {
      const response = await this.authenticatedFetch(`${this.baseURL}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (response.ok) {
        this.clearTokens();
      }

      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || 'Account deletion failed',
        error: error.data?.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      };
    }
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }
}
