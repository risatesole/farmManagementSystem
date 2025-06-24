import BrowserVariableManager from '../browser/BrowserVariableManager';
const browserVariable = new BrowserVariableManager();

class TokenManager {
    setRefreshToken(token: string) {
        browserVariable.setVariable('refreshtoken', token);
    }
    getRefreshToken() {
        return browserVariable.getVariable('refreshtoken');
    }
    setAccessToken(token: string) {
        // browserVariable.setVariable('accesstoken', token);
        sessionStorage.setItem('accesstoken', token);
    }
    getAccessToken() {
        // browserVariable.getVariable('accesstoken');
        sessionStorage.getItem('accesstoken');
        //todo mechanism that checks if access token still valid, if not it asks for another one
    }
}
export default TokenManager;
