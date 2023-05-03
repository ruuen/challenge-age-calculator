import AgeCalculator from "./components/AgeCalculator/AgeCalculator";
import "./App.scss";

function App() {
  return (
    <>
      <main className="page-container">
        <h1 className="visually-hidden">Age Calculator</h1>
        <AgeCalculator />
      </main>
    </>
  );
}

export default App;
