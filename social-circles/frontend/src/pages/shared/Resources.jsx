import { useAuthContext } from "../../contexts/AuthContextHandler";
import GuestHeader from "../../components/headers/GuestHeader";
import UserHeader from "../../components/headers/UserHeader";
import WebStreamLoader from "../../components/WebStream/WebStreamLoader";

function Resources() {
  const { isAuth } = useAuthContext();

  return (
    <>
      {isAuth ? (
        <WebStreamLoader/>,
        <UserHeader />
      ) : (
        <WebStreamLoader/>,
        <GuestHeader />
      )}
    </>
  );
}

export default Resources;
