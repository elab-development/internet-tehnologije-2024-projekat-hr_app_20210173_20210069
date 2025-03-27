import axios from 'axios'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//nase reusable komponente da smanjimo kolicinu koda koji se ponavlja
import AuthLayout from '../Reusable/AuthLayout';
import FormInput from '../Reusable/FormInput';
import FormSelect from '../Reusable/FormSelect';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    user_role: 'worker',
  });

  const [errors, setErrors] = useState({});
  const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Legal', 'Support'];
  const userRoles = [
    { label: 'Worker', value: 'worker' },
    { label: 'HR Worker', value: 'hr worker' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // čisti grešku na kucanje
  };

  //kreiranje korisnika
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/register', form);
      alert(res.data.message); // Alert sa servera
      navigate('/'); // Preusmeravanje na login
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors); // Laravel greske
      } else {
        alert('Došlo je do greške.');
      }
    }
  };

  return (
    <AuthLayout imageUrl="/images/auth2.png">
      <form onSubmit={handleSubmit}>
        <h2>Registracija</h2>

        <FormInput
          label="Ime i prezime"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}

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

        <FormSelect
          label="Odeljenje"
          name="department"
          value={form.department}
          onChange={handleChange}
          options={departments}
        />
        {errors.department && <p style={{ color: 'red' }}>{errors.department[0]}</p>}

        <FormInput
          label="Pozicija"
          name="position"
          value={form.position}
          onChange={handleChange}
        />
        {errors.position && <p style={{ color: 'red' }}>{errors.position[0]}</p>}

        <FormSelect
          label="Tip korisnika"
          name="user_role"
          value={form.user_role}
          onChange={handleChange}
          options={['worker', 'hr_worker']}
        />
        {errors.user_role && <p style={{ color: 'red' }}>{errors.user_role[0]}</p>}

        <button type="submit">Registruj se</button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
