function Loading() {
    return (
        <>
        <div className="col-12 d-flex justify-content-center" style={{paddingTop: '20em'}}>
        <div className="spinner-border mt-5" role="status"
            style={{ width: '10rem', height: '10rem'}}>
            <span className="sr-only">Loading...</span>
        </div>
        </div>
        </>
    )
}

export default Loading;