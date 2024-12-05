import React from 'react'
import AddLocation from './AddLocation'
import MapComponent from './MapComponent'
import MapWithDistance from './MapWithDistance'

const App = () => {
  return (
    <div>
      <h1>Map with markers</h1>
      <AddLocation/>
      <MapComponent/>
      <hr />
      <MapWithDistance/>
    </div>
  )
}

export default App