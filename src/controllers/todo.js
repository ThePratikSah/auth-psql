import {
  createTodo,
  deleteTodo,
  readTodo,
  updateTodo,
} from "../services/todo.services";

export const createNewTodoController = async (req, res, next) => {
  try {
    const todo = await createTodo(req.body, next);
    res.status(201).json({ todo });
  } catch (error) {
    next(error);
  }
};

export const readTodoController = async (req, res, next) => {
  try {
    const todo = await readTodo(req.params, next);
    res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
};

export const updateTodoController = async (req, res, next) => {
  try {
    const response = await updateTodo(req.params, req.body, next);
    res
      .status(201)
      .json({ response: response[0] == 1 ? "Updated" : "Failed to update" });
  } catch (error) {
    next(error);
  }
};

export const deleteTodoController = async (req, res, next) => {
  try {
    const response = await deleteTodo(req.params, next);
    res
      .status(201)
      .json({ response: response == 1 ? "Deleted" : "Failed to delete" });
  } catch (error) {
    next(error);
  }
};
