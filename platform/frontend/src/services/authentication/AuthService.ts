// import BrowserVariableManager from './subServices/browser/BrowserVariableManager';
// import HttpClient from './subServices/network/HTTPclient';
import SignUpService from './subServices/sign/SignUp/SignUp';
import SignInService from './subServices/sign/Signin/Signin';

// const baseURL: String = 'localhost:3000';

/**
 * The AuthService handles authentication-related functionality in the frontend.
 * It typically manages:
 * - User login/logout operations
 * - Token storage and retrieval (JWT, session tokens)
 * - Authentication state management
 * - Protected route verification
 * - Token refresh mechanisms
 * - User session persistence
 *
 * This service acts as a bridge between the frontend application and backend authentication APIs,
 * providing a centralized place to handle all auth-related logic while abstracting implementation details.
 */

export class AuthService {

    public async signUp(firstname: String, lastname: String, username: String, email: String, password: String, birthdate: Date, agreedTermsOfService: Boolean) {
        return SignUpService(firstname,lastname,username,email,password,birthdate,agreedTermsOfService);
    }

    public async signIn(email: String, password: String) {
        return SignInService(email,password);
        
    }

    public async signOut() {
        /* ... */
    }

    public async refreshAccessToken() {
        /* ... */
    }

    public isAuthenticated() {
        /* ... */
    }

    public getAccessToken() {
        /* ... */
    }

    public getRefreshToken() {
        /* ... */
    }
}
