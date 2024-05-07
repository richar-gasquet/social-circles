/* Component to display a loading spinner if necessary*/
function Loading({ size = "10rem", paddingTop = "20em" }) {
  return (
    <>
      <div className="col-12 d-flex justify-content-center" style={{ paddingTop }}>
        <div
          className="spinner-border"
          role="status"
          style={{ width: size, height: size }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
}

export default Loading;