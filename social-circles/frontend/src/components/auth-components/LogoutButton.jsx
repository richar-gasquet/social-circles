function Logout() {
  const handleLogout = (e) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  return <button onClick={handleLogout}>Log Out</button>;
}

export default Logout;
