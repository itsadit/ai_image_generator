import { useState } from 'react'
import ImageGenerator from "./ImageGenerator";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ImageGenerator />
    </>
  )
}

export default App
