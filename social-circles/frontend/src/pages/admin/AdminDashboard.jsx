import AdminHeader from '../headers/AdminHeader';
import LogoutButton from '../auth/LogoutButton';
import { useUserContext } from '../../contexts/UserContextHandler';

function AdminDashboard() {
  const { userData } = useUserContext();

  return (
    <>
      <AdminHeader />
      <h2>This is the Admin Dashboard.</h2>
      <p>
        This information is secret. You should only be able to see it if you're
        logged in as admin
      </p>
      <p>Here's some info about you!</p>
      <div>
        <p>Name: {userData.name} </p>
        <p>Email: {userData.email} </p>
      </div>
      <LogoutButton />
    </>
  );
}

export default AdminDashboard;
