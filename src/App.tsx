import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
    const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe(); // cleanup
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
            <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>➕ New</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "8px" }}>
            {todo.content}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              title="Delete todo"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "20px" }}>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
              <button onClick={signOut}>Sign out</button>
      </div>
    </main>
  );
}

export default App;
