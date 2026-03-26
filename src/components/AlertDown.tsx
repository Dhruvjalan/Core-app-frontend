// crossroads-frontend/src/components/AlertDown.tsx
import { Alert, AlertIcon, Slide, AlertStatus } from "@chakra-ui/react";
import React from "react";

interface AlertDownProps {
  text: string;
  mode: AlertStatus; 
}

const AlertDown: React.FC<AlertDownProps> = ({text, mode}:AlertDownProps) => {
  // Using Chakra's built-in colors instead of custom gradients
  

  return (
    <Slide direction="top" style={{ 
    position: 'fixed',
    top: '5%',
    left: '30%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    width: '50vw',
    height: "20px",
    minWidth: '250px',
}}>
    <Alert
        status={mode}
        display="flex"
        alignItems="center"
        borderRadius="8px"
        padding="12px 20px"
        boxShadow="0 0 10px rgba(72, 187, 120, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.2)"
        background="linear-gradient(145deg, #38a169, #48bb78)"
        color="white"
        fontWeight="bold"
        fontSize="16px"
        height="auto"
    >
        <AlertIcon boxSize="24px" mr={3} color="white" />
          {text}
    </Alert>
</Slide>
  );
};

export default AlertDown;