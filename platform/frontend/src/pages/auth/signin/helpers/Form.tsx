import type { UserSigninCredentials,ServerResponse } from '../../../../services/authentication/types';
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { AuthService } from '../../../../services/authentication/AuthService';
import successSignInUIProcedure from './successSignInUIProcedure';
import styles from '../styles.module.css';
import { useNavigate } from "react-router-dom";

function Formulario() {
  const navigator = useNavigate();
  const [formData, setFormData] = useState<UserSigninCredentials>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof UserSigninCredentials)[] = ['email', 'password'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const authservice = new AuthService();
    const credentials: UserSigninCredentials = {
      email: formData.email,
      password: formData.password,
    };

    const result: ServerResponse = await authservice.signIn(credentials.email, credentials.password);

    if (result.success == false) {
      alert(result.message);
    } else {
      successSignInUIProcedure(navigator);
      
    }
  };
  return (
    <div className={styles.formcontainer}>
      <p>Sign In</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email"></label>
          <input type="text" id="email" name="email" placeholder="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="password"></label>
          <input type="password" id="password" name="password" placeholder="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">LogIn</button>
      </form>
    </div>
  );
}

export default Formulario;