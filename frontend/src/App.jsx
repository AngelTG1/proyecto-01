import React from 'react'
import io from 'socket.io-client'

const socket = io('/')

function App() {
  return (
    <div>Hello world</div>
  )
}

export default App