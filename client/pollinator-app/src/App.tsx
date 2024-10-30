import watercolor from "./assets/watercolor-image.png";
import "./App.css";
import Button from "@mui/material/Button";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>The Pollinator</h1>
      </header>
      <body className="App-body">
        <div>
          <h2 className="title-weather-data">Weather Data</h2>
          <div className="weather-data">
            <h3 className="location">Location </h3>
            <h3 className="calendar">Calendar</h3>
          </div>
          <Button variant="contained">Fetch Weather Data</Button>
          <img src={watercolor} className="App-logo" alt="logo" />
        </div>
      </body>
    </div>
  );
}

export default App;
