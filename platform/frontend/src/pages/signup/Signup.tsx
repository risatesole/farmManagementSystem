import type {
  UserCredentials,
  AuthResponse,
} from "../../services/authentication/AuthService";
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authentication/AuthService";

function Formulario() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState<UserCredentials>({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    birthdate: "",
    agreedTermsOfService: false,
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
    const requiredFields: (keyof UserCredentials)[] = [
      "firstname",
      "lastname",
      "username",
      "password",
      "birthdate",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (!formData.agreedTermsOfService) {
      alert("You must agree to the Terms of Service");
      return;
    }

    // console.log("Form submitted:", formData);
    const authservice = new AuthService();
    const credentials: UserCredentials = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      birthdate: formData.birthdate,
      username: formData.username,
      password: formData.password,
      agreedTermsOfService: formData.agreedTermsOfService,
    };
    const result: AuthResponse = await authservice.signUp(credentials);

    if (result.success == false) {
      alert(result.message);
    } else {
      alert("successfull signup");
      navigate("/login");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstname">firstName</label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="lastname">Lastname</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Passsword</label>
        <input
          type="text"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="birthdate">Birthdate</label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="agreedTermsOfService">
          <input
            type="checkbox"
            id="agreedTermsOfService"
            name="agreedTermsOfService"
            checked={formData.agreedTermsOfService}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                agreedTermsOfService: e.target.checked,
              }))
            }
          />
          I agree to the Terms of Service
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

const SignupPage = () => {
  return (
    <div>
      <Formulario />
    </div>
  );
};

export default SignupPage;
