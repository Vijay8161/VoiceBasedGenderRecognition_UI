
import "./App.css"
import Header from "./components/Header"
import AudioUpload from "./components/AudioUpload"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <AudioUpload />
      </main>
      <Footer />
    </div>
  )
}

export default App
