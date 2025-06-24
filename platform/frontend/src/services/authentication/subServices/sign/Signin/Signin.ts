import type { ServerResponse } from '../../../types';
import HttpClient from '../../network/HTTPclient';
import TokenManager from '../../token/TokenManager';

const client = new HttpClient();
const tokenManager = new TokenManager();

async function SignInService(email: String, password: String) {
    const signinResponse = await client.execute<ServerResponse>({
        url: 'http://localhost:3000/signin',
        method: 'POST',
        body: {
            email: email,
            password: password,
        },
    });
    if (signinResponse.data.success == true) {
        const refreshtoken = signinResponse.data.tokens?.refreshtoken;
        const accessToken = signinResponse.data.tokens?.accesstoken;

        if (refreshtoken) {
            tokenManager.setRefreshToken(refreshtoken);
        }

        if (accessToken) {
            tokenManager.setAccessToken(accessToken);
        }
    }
    return signinResponse.data;
}
export default SignInService;
