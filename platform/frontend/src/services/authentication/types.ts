
export type UserCredentials = {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  birthdate: string;
  agreedTermsOfService: boolean;
};

export type UserSigninCredentials = {
  email: string;
  password: string;
};

export type AuthTokens = {
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


export type ServerResponse = {
    success: boolean;
    message: string;
    data?: {
        firstname: string;
        lastname: string;
        birthdate: string;
        email: string;
    };
    error?: {
        code: string;
        message: string;
    };
    tokens?: {
        accesstoken?: string;
        refreshtoken?: string;
    };
};