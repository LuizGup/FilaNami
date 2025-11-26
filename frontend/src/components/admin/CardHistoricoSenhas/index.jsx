const CardHistoricoSenhas = ({
  passwordNumber,
  generationTime,
  callTime,
  statusText, 
  statusClass, 
}) => {

  return (
    <div className="row align-items-center border-bottom py-3 px-4 hover-bg-light transition-base">
      <div className="col fw-bold text-dark">{passwordNumber}</div>
      <div className="col text-muted small">{generationTime}</div>
      <div className="col text-muted small">{callTime}</div>
      <div className="col">
        <span
          className={`badge rounded-pill px-3 py-2 fw-normal ${statusClass}`} 
        >
          <i
            className="bi bi-circle-fill me-1"
            style={{ fontSize: "6px", verticalAlign: "middle" }}
          ></i>
          {statusText}
        </span>
      </div>
    </div>
  );
};

export default CardHistoricoSenhas;
