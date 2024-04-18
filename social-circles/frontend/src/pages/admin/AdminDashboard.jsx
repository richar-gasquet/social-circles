import AdminHeader from '../../components/headers/AdminHeader';
import LogoutButton from '../../components/auth-components/LogoutButton';
import { useUserContext } from '../../contexts/UserContextHandler';
import WebStreamLoader from '../../components/WebStream/WebStreamLoader';

function AdminDashboard() {
  const { userData, isLoading } = useUserContext();
  if (isLoading) {
    return (
      <>
      <AdminHeader />
      <div className="col-12 d-flex justify-content-center">
        <div className="spinner-border mt-5" role="status"
          style={{ width: '10rem', height: '10rem'}}>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      </>
    )
  }
  return (
    <>
      <WebStreamLoader/>
      <AdminHeader />
      <h2>This is the Admin Dashboard.</h2>
      <p>
        This information is secret. You should only be able to see it if you're
        logged in as admin
      </p>
      <p>Here's some info about you!</p>
      <div>
        <p>Name: {userData.first_name} {userData.last_name}</p>
        <p>Email: {userData.email} </p>
      </div>
      <LogoutButton />
    </>
  );
}

export default AdminDashboard;
