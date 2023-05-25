const { MongoClient, ObjectId } = require("mongodb");
const databaseURI = "mongodb://localhost:27017/";

const client = new MongoClient(databaseURI);

module.exports.init = async function init() {
  try {
    const mongoClient = await client.connect();

    const database = mongoClient.db("Developer");

    const todoCollection = database.collection("CRUD with Express");

    async function findById(todoIDString) {
      try {
        const todoID = new ObjectId(todoIDString);

        return await todoCollection.findOne(
          { _id: todoID },
          { projection: { _id: 0, content: 1, checked: 1 } }
        );
      } catch (error) {
        return null;
      }
    }

    async function getAllTodos() {
      return await todoCollection.find({}).toArray();
    }

    async function createTodo(content) {
      const todo = {
        content,
        checked: false,
      };

      const result = await todoCollection.insertOne(todo);

      return result.insertedId;
    }

    async function checkTodo(todoIDString) {
      const todo = await findById(todoIDString);

      if (todo == null) {
        return false;
      }

      const todoID = new ObjectId(todoIDString);

      const updateTodoOperation = {
        $set: {
          checked: !todo.checked,
        },
      };

      const result = await todoCollection.updateOne(
        { _id: todoID },
        updateTodoOperation
      );

      return result.acknowledged && result.modifiedCount == 1;
    }

    async function deleteTodoByID(todoIDString) {
      const todoID = new ObjectId(todoIDString);

      const todoQuery = { _id: todoID };

      const result = await todoCollection.deleteOne(todoQuery);

      return result.acknowledged && result.deletedCount == 1;
    }

    async function deleteCheckedTodos() {
      const todosQuery = {
        checked: true,
      };

      const result = await todoCollection.deleteMany(todosQuery);

      return result.acknowledged;
    }

    return {
      findById,
      getAllTodos,
      createTodo,
      checkTodo,
      deleteTodoByID,
      deleteCheckedTodos,
    };
  } catch (error) {
    await client.close();

    throw error;
  }
};
