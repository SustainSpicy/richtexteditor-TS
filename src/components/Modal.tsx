import React, { useState } from "react";
import { Box, Modal, Stack, Typography, Button } from "@mui/material";

interface CustomModalProps {
  children: React.ReactNode;
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalContainer = ({ children, open, onClose }: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default ModalContainer;
