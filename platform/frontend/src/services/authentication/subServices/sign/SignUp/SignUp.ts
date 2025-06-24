import type {ServerResponse} from '../../../types'
import HttpClient from '../../network/HTTPclient';

const client = new HttpClient();

/**
 * Sign up service for signing up to the server
 */
async function SignUpService(firstname: String, lastname: String, username: String, email: String, password: String, birthdate: Date,agreedTermsOfService:Boolean) {
    // 💡 use HTTPclient.ts to send sign up request to server
    const signupResponse = await client.execute<ServerResponse>({
        url: 'http://localhost:3000/signup',
        method: 'POST',
        body: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            birthdate: birthdate,
            agreedTermsOfService: agreedTermsOfService
        },
    });
    return signupResponse.data
}

export default SignUpService;