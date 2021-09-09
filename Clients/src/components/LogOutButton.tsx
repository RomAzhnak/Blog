import { useAppDispatch } from '../app/hooks';
import { useHistory } from "react-router-dom";
import { clearUser } from '../redux/userSlice';

type Props = {
};
const LogOutButton: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();  

let history = useHistory();
  return (
      <p>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            dispatch(clearUser());
            history.push("/");
            
          }}
        >
          Sign out
        </button>
      </p>
  );
}

export default LogOutButton;
