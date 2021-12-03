import Todo from "../Models/todos";

// create new todo
export const createTodo = async (body, next) => {
  try {
    const { title } = body;
    return await Todo.create({
      title,
    });
  } catch (error) {
    next(error);
  }
};

// read todo
export const readTodo = async (params, next) => {
  try {
    const { id } = params;
    if (!id) return await Todo.findAll();
    return await Todo.findByPk(id);
  } catch (error) {
    next(error);
  }
};

// update todo
export const updateTodo = async (params, body, next) => {
  try {
    const { id } = params,
      { title } = body;

    return await Todo.update(
      {
        title,
      },
      {
        where: {
          id,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// delete todo
export const deleteTodo = async (params, next) => {
  try {
    const { id } = params;

    return await Todo.destroy({
      where: {
        id,
      },
    });
  } catch (error) {
    next(error);
  }
};
