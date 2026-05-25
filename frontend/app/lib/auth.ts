let memoryToken: string | null = null;

export const setUserData = (id: string, role: string, token?: string) => {
  localStorage.setItem('userId', id);
  localStorage.setItem('role', role);
  if (token) sessionStorage.setItem('token', token);
};

export const getToken = () => sessionStorage.getItem('token');
export const getUserId = () => localStorage.getItem('userId');
export const getRole = () => localStorage.getItem('role');
export const removeUserData = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  sessionStorage.removeItem('token');
};




export const isAuthenticated = () => !!localStorage.getItem('userId');
export const isAdmin = () => localStorage.getItem('role') === 'ADMIN';