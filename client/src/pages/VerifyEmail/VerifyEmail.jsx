import React, { useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import { useVerifyEmail } from "../../utils/react-query/queries";
import { useCookies } from "react-cookie";

const VerifyEmail = () => {
  const { user_id, token } = useParams();
  const [cookies, setCookie] = useCookies();
  const { data, isLoading } = useVerifyEmail({ user_id, token });

  useEffect(() => {
    if (!isLoading) {
      if (data.token) setCookie("playlist_token", data.token);
    }
  }, [isLoading]);

  return (
    <div className="w-100">
      <Row>
        <Col xs={12} sm={12} md={3} lg={4}></Col>
        <Col className="text-center mt-5 bg-white rounded p-5">
          {isLoading ? (
            <Spinner animation="border" />
          ) : data ? (
            <>
              <p className="m-0 p-0">Your email has been verified.</p>
              <p className="m-0 p-0">
                <Link to="/" className="text-primary">
                  Click here
                </Link>
                &nbsp;to go to Home page
              </p>
            </>
          ) : (
            <>Something went wrong. Please connect with us.</>
          )}
        </Col>
        <Col xs={12} sm={12} md={3} lg={4}></Col>
      </Row>
    </div>
  );
};

export default VerifyEmail;
