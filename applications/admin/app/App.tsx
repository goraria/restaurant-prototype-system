import { useEffect, useState } from 'react'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import supabase from "@/utils/supabase.ts";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'


export default function App() {
  const [count, setCount] = useState(0)

  // const [todos, setTodos] = useState([])
  //
  // useEffect(() => {
  //   async function getTodos() {
  //     const { data: todos } = await supabase.from('todos').select()
  //
  //     if (todos.length > 1) {
  //       setTodos(todos)
  //     } else {
  //       setTodos([])
  //     }
  //   }
  //
  //   getTodos()
  // }, [])

  useEffect(() => {

  }, []);

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/*<div>*/}
      {/*  {todos.map((todo) => (*/}
      {/*    <li key={todo}>{todo}</li>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </>
  )
}
