import React, { useState } from "react";
import waves from "../../images/waves.png";
import { Container, Row, Col, Image } from "react-bootstrap";
import PlayInstructionsModal from "../../components/PlayInstructions/PlayInstructions";

import "./footer.styles.css";

const FooterComponent = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Container className='footer-div' fluid>
        <Row>
          <Col className='footer-content' onClick={() => setModalShow(true)}>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{ cursor: "pointer" }}
            >
              How to Play
              <span className='arrow-symbol'>&#129046;</span>
            </div>
          </Col>
        </Row>
        <PlayInstructionsModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </Container>
        <Image className='footer-image' src={waves} alt='music waves' />
    </>
  );
};

export default FooterComponent;
