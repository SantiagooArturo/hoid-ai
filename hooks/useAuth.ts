import { useState, useEffect } from 'react';

// Credenciales estáticas para pruebas
const STATIC_USERS = [
  {
    email: 'test.student@university.edu',
    password: 'Test123!',
    uid: '1',
    occupation: 'university_student'
  }
];

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular verificación de autenticación
    const checkAuth = () => {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, occupation: string) => {
    try {
      setError(null);
      
      // Verificar si el usuario ya existe
      if (STATIC_USERS.some(u => u.email === email)) {
        throw new Error('User already exists');
      }

      // Crear nuevo usuario
      const newUser = { email, uid: Date.now().toString(), occupation };
      STATIC_USERS.push({ email, password, uid: newUser.uid, occupation });
      
      // Guardar en localStorage y estado
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Verificar credenciales
      const user = STATIC_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Crear objeto de usuario sin la contraseña
      const userData = { email: user.email, uid: user.uid, occupation: user.occupation };
      
      // Guardar en localStorage y estado
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      localStorage.removeItem('auth_user');
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    logout
  };
} 