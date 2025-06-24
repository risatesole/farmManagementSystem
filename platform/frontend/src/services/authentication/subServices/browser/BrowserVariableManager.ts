/**
 * Service related to the storge of variables inside browser local storage
 * the main pourpose of this class is to set and retrive local storage variables.
 * the services that will depend in this service are tokens
 */
class BrowserVariableManager {
    setVariable(key:string,value:string){
        localStorage.setItem(key, value);

    }
    getVariable(token:string){
        return localStorage.getItem(token);
    }
}

export default BrowserVariableManager;