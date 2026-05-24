export const setUserData = (id: string, role: string) => {
  localStorage.setItem('userId', id);
  localStorage.setItem('role', role);
};

export const getUserId = () => localStorage.getItem('userId');
export const getRole = () => localStorage.getItem('role');
export const removeUserData = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
};
export const isAuthenticated = () => !!localStorage.getItem('userId');
export const isAdmin = () => localStorage.getItem('role') === 'ADMIN';