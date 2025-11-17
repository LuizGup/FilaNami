import { useNavigate } from "react-router-dom";

function RouteButton({ label, to, icon }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary btn-lg route-btn-admin d-flex align-items-center gap-2"
      onClick={handleClick}
    >
      {icon && <span className="route-btn-icon">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default RouteButton;
