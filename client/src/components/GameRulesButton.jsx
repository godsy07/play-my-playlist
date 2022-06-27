import React, { useState } from "react";
import { Button } from "react-bootstrap";

import PlayInstructionsModal from "./PlayInstructions/PlayInstructions";

const GameRulesButton = ({ host_rules }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  return (
    <>
      <Button
        size='lg'
        style={{ height: "60px", width: "100%", borderRadius: "10px" }}
        onClick={() => setShowInstructions(true)}
      >
        Room Rules
      </Button>
      <PlayInstructionsModal
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
      >
        {host_rules && (
          <>
            Game rules set by the Host.
            <br />
            {host_rules}
          </>
        )}
      </PlayInstructionsModal>
    </>
  );
};

export default GameRulesButton;
