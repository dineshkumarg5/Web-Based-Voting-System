import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        API.get(`polls/results/${id}/`).then((res) => {
            setData(res.data);
        });
    }, [id]);

    if (!data) return <div className="page-center"><p>Loading...</p></div>;

    return (
        <div className="main-page">
            <div className="content-card">
                <button
                    className="btn btn-link ps-0 mb-3"
                    onClick={() => navigate("/polls")}
                >
                    ← Back to Polls
                </button>

                <h4 className="mb-4">{data.poll}</h4>

                {data.results.map((r, index) => (
                    <div className="result-item" key={index}>
                        <span>{r.choice}</span>
                        <span className="vote-count">{r.votes} vote{r.votes !== 1 ? "s" : ""}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
