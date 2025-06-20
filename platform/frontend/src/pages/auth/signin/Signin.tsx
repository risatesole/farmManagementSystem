import type {
  UserCredentials,
  AuthResponse,UserSigninCredentials
} from "../../../services/authentication/AuthService";
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authentication/AuthService";
import styles from "./styles.module.css";

function Formulario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserSigninCredentials>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log("change");
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof UserSigninCredentials)[] = [
      "email",
      "password",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    // console.log("Form submitted:", formData);
    const authservice = new AuthService();
    const credentials: UserSigninCredentials = {
      email: formData.email,
      password: formData.password,
    };
    const result: AuthResponse = await authservice.signIn(credentials.email,credentials.password);
    
    // todo: put the tokens in the localstorage of the browser then 
    const accesstoken: String | undefined = result.tokens?.accesstoken;
    const refreshToken: String | undefined = result.tokens?.refreshtoken;

    if (result.success == false) {
      alert(result.message);
    } else {
      // console.log(result.error?.message);

      alert(`${result.message}`);
      alert("after signin in functionality not included jet")
    }
  };
  return (
    <div className={styles.formcontainer}>
      <p>Sign In</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email"></label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">LogIn</button>
      </form>
    </div>
  );
}

const SigninPage = () => {
  return (
    <div>
      <Formulario />
    </div>
  );
};

export default SigninPage;
