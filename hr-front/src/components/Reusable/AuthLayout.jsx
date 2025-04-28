import React from 'react';

// AuthLayout je reusable komponenta koja prikazuje levo formu, a desno sliku.
const AuthLayout = ({ children, imageUrl }) => {
  return (
    <div className="auth-container">
      {/* Leva strana – forma */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          {children}
        </div>
      </div>

      {/* Desna strana – pozadinska slika */}
      <div className="auth-image-side">
        <img src={imageUrl} alt="Auth Illustration" />
      </div>

    </div>
  );
};

export default AuthLayout;
