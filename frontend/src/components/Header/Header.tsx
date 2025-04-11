import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import TaskFormModal from "../TaskFormModal/TaskFormModal";

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: unknown) => {
    console.log("Данные задачи:", data);
    // Здесь можно вызвать API для создания задачи
  };

  return (
    <>
      {/* Хедер */}
      <AppBar position="static" sx={{ marginBottom: "20px" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Management System
          </Typography>
          <Button color="inherit" component={Link} to="/boards">
            Доски
          </Button>
          <Button color="inherit" component={Link} to="/issues">
            Задачи
          </Button>
          <Button color="inherit" onClick={handleOpenModal}>
            Создать задачу
          </Button>
        </Toolbar>
      </AppBar>

      {/* Модальное окно */}
      <TaskFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode={"create"}
      />
    </>
  );
};

export default Header;
