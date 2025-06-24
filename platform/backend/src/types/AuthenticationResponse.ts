
export type AuthenticationResponse = {
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

