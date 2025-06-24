type NavigateFunction = (path: string) => void;

function successSignInUIProcedure(navigate: NavigateFunction) {
  alert("after signin in functionality not included yet");
  navigate("/me");
}

export default successSignInUIProcedure;
