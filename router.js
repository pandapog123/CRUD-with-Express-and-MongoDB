const express = require("express");
const router = express.Router();
const { init } = require("./database");

module.exports.createRouter = async function createRouter() {
  const databaseActions = await init();

  // Sends all todos to user
  router.get("/", async (request, response) => {
    const allTodos = await databaseActions.getAllTodos();

    response.send(allTodos);
  });

  // Sends specific todos
  router.get("/:todo_id", async (request, response) => {
    const todoID = request.params.todo_id;

    const todo = await databaseActions.findById(todoID);

    if (todo == null) {
      response.send(`Could not find Todo with id of ${todoID}`);

      return;
    }

    response.send(todo);
  });

  // Creates a new Todo
  router.post("/todo/create", async (request, response) => {
    if (
      request.body == null ||
      request.body.content == null ||
      typeof request.body.content != "string"
    ) {
      response.send("Content parameter on body is not specified");

      return;
    }

    const createRequest = await databaseActions.createTodo(
      request.body.content
    );

    response.send(
      `Successfully created todo. Todo ID is ${createRequest.toString()}`
    );
  });

  // Toggles the `check` property in the todo
  router.post("/todo/check", async (request, response) => {
    if (
      request.body == null ||
      request.body.id == null ||
      typeof request.body.id != "string"
    ) {
      response.send("Invalid Request");

      return;
    }

    const todoCheckRequest = await databaseActions.checkTodo(request.body.id);

    if (!todoCheckRequest) {
      response.send("Error ocurred when checking operation was sent");

      return;
    }

    response.send(`Successfully checked todo of id ${request.body.id}`);
  });

  // deletes all todos with the `check` property as true
  router.delete("/", async (request, response) => {
    const deleteRequest = await databaseActions.deleteCheckedTodos();

    if (!deleteRequest) {
      response.send("An error occured when deleting all checked todos");
      return;
    }

    response.send("Successfully deleted all checked todos");
  });

  // deletes a todo
  router.delete("/:id", async (request, response) => {
    const deleteRequest = await databaseActions.deleteTodoByID(
      request.params.id
    );

    if (!deleteRequest) {
      response.send("An error occured when deleting your todo");

      return;
    }

    response.send(`Successfully deleted todo with ID of ${request.params.id}`);
  });

  return router;
};
