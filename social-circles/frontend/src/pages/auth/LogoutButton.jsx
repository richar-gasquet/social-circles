function Logout() {
  const handleLogin = (e) => {
    window.location.href = "https://localhost:5000/logout";
  };

  return <button onClick={handleLogin}>Log Out</button>;
}

export default Logout;
