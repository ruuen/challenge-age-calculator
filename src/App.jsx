import AgeCalculator from "./components/AgeCalculator/AgeCalculator";
import "./App.scss";

function App() {
  return (
    <>
      <h1 className="visually-hidden">Age Calculator</h1>
      <main className="page-container">
        <AgeCalculator />
      </main>
    </>
  );
}

export default App;
