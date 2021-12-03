import express from "express";
import {
  createNewTodoController,
  deleteTodoController,
  readTodoController,
  updateTodoController,
} from "../controllers/todo";

const router = express.Router();

router.post("/", createNewTodoController);

router.get("/", readTodoController);

router.get("/:id", readTodoController);

router.patch("/:id", updateTodoController);

router.delete("/:id", deleteTodoController);

export default router;
