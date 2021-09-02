import { useAppDispatch } from '../app/hooks';
import { useHistory } from "react-router-dom";
import { clearUser } from '../redux/userSlice';



type Props = {
};

const AuthButton: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();  

let history = useHistory();
  return (
  
      <p>
        <button
          onClick={() => {
            dispatch(clearUser());
            history.push("/");
          }}
        >
          Sign out
        </button>
      </p>
  );
}

export default AuthButton;