import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// redirect to videomeet
export default function MeetRedirect() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      navigate(`/videomeet?code=${code}`, { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [code, navigate]);

  return null;
}
