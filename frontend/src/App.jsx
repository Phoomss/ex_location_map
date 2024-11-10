import React from 'react'
import AddLocation from './AddLocation'
import MapComponent from './MapComponent'

const App = () => {
  return (
    <div>
      <h1>Map with markers</h1>
      <AddLocation/>
      <MapComponent/>
    </div>
  )
}

export default App