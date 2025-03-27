import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//nase reusable komponente da smanjimo kolicinu koda koji se ponavlja
import AuthLayout from '../Reusable/AuthLayout';
import FormInput from '../Reusable/FormInput';

import { Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
    //za navigaciju
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  //login metoda
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', form);
  
      const user = {
        id: res.data.id,
        email: res.data.email,
        user_role: res.data.role,
      };
  
      const token = res.data.token;
  
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
  
      setUser({ user, token });
  
      if (user.user_role === 'hr worker') {
        navigate('/hr-home');
      } else {
        navigate('/home');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert(err.response.data.error); // Neispravni podaci
      } else {
        alert('Došlo je do greške.');
      }
    }
  };
  

  return (
    <AuthLayout imageUrl="/images/auth2.png">
      <form onSubmit={handleSubmit}>
        <h2>Prijava</h2>

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}

        <FormInput
          label="Lozinka"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}

        <button type="submit">Prijavi se</button>
        <div className="auth-link-wrapper">
            <p>Nemate nalog? <Link to="/register">Registrujte se</Link></p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;