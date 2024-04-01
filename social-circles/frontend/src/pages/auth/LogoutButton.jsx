function Logout() {
  const handleLogin = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  return <button onClick={handleLogin}>Log Out</button>;
}

export default Logout;
