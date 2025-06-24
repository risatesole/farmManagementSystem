import type {ServerResponse} from '../../../types'
import HttpClient from '../../network/HTTPclient';

const client = new HttpClient();

async function SignInService(email:String, password:String){
    const signinResponse = await client.execute<ServerResponse>({
            url: 'http://localhost:3000/signin',
            method: 'POST',
            body: {
                
                email: email,
                password: password,
                
            },
        });
        if(signinResponse.data.success== true){
            // todo:
            // save the tokens in the browser use browser service for that
            // else dont save anything return  the response
        }
        return signinResponse.data
}
export default SignInService