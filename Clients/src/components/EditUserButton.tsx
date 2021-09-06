import { useHistory } from "react-router-dom";

type Props = {
};
const EditUserButton: React.FC<Props> = (props) => {

let history = useHistory();
  return (
      <p>
        <button
          onClick={() => {
            history.push("/edituser");
          }}
        >
          Edit User
        </button>
      </p>
  );
}

export default EditUserButton;
