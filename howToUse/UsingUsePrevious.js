import React, { useState } from 'react'
import usePrevious from 'usePrevious'

const UsingUsePrevious = () => {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  const increase = () => {
    setCount(state => state + 1)
  }

  const decrease = () => {
    setCount(state => state - 1)
  }

  return (
    <>
      <p>Previous count: {previousCount}</p>
      <p>Current count: {count}</p>
      <button onClick={decrease}>-</button>
      <button onClick={increase}>+</button>
    </>
  )
}

export default UsingUsePrevious


