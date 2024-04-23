import axios from "axios"
import { useState } from "react"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function App() {
  const [file, setFile] = useState(null)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async () => {
    if (!file || loading) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post(`${BASE_URL}/fileupload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setOutput(response.data)
    } catch (error) {
      console.error("Upload error:", error)
      setOutput("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}/feedback`, input, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
      setOutput(response.data)
    } catch (error) {
      setOutput("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOutput = (output) => {
    switch (output.category) {
      case "statement quality":
        return (
          <div>
            <h3 className="text-xl font-bold pb-4">
              Feedback on the quality of the topic sentence or thesis statement:
            </h3>
            <p>{output.feedback}</p>
          </div>
        )
      case "idea development":
        return (
          <div>
            <h3 className="text-xl font-bold pb-4">
              Feedback on the development of ideas throughout the writing:
            </h3>
            <p>{output.feedback}</p>
          </div>
        )
      case "academic quality":
        return (
          <div>
            <h3 className="text-xl font-bold pb-4">
              Feedback on the academic quality of the language:
            </h3>
            <p>{output.feedback}</p>
          </div>
        )
      case "transition":
        return (
          <div>
            <h3 className="text-xl font-bold pb-4">
              Feedback on transitional phrases:
            </h3>
            <p>{output.feedback}</p>
          </div>
        )
      case "sources":
        return (
          <div>
            <h3 className="text-xl font-bold pb-4">
              Feedback on the use of sources and evidence:
            </h3>
            <p>{output.feedback}</p>
          </div>
        )
      case "table":
        return (
          <div className="p-4">
            <h1 className="text-lg font-semibold mb-4">Feedback</h1>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Sentence</th>
                  <th className="px-4 py-2 text-left">Error Type</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {output.feedback.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-gray-500 border-b"
                  >
                    <td className="px-4 py-2">{item.sentence || "N/A"}</td>
                    <td className="px-4 py-2">{item.errorType || "N/A"}</td>
                    <td className="px-4 py-2">{item.description || "N/A"}</td>
                    <td className="px-4 py-2">{item.suggestion || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return <p>{output}</p>
    }
  }

  return (
    <div>
      <div
        id="banner"
        className="sticky top-0 z-50 flex justify-between items-center bg-violet-900 text-violet-50 text-sm py-2 px-4 w-full"
      >
        <p className="flex-grow text-center">
          ✨ What&apos;s new? You can now upload files for feedback. Please keep
          the size of the uploaded file no more than 1MB.
        </p>
        <button
          className="ml-4"
          onClick={() => {
            document.getElementById("banner").style.display = "none"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h1 className="text-center font-bold text-3xl text-gray-100 my-8">
        AI Writing Assistant
      </h1>

      <div className="flex sm:flex-col md:flex-row justify-center mx-8">
        <div className="w-1/2 bg-gray-800 p-4 rounded-lg h-fit">
          <textarea
            className="w-full h-80 bg-gray-700 active:border-gray-100 text-gray-100 p-4 rounded-lg resize-none"
            placeholder="Start typing here... or upload a .docx file."
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex justify-end pt-4">
            <form
              encType="multipart/form-data"
              onSubmit={(e) => {
                e.preventDefault() // Prevent actual form submission
                handleFileUpload()
              }}
              className="mr-auto"
            >
              <input
                className="bg-gray-900 text-gray-500 font-semibold py-2 pl-4 rounded-l-lg"
                type="file"
                accept=".docx, doc"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button
                className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded-r-lg"
                onClick={handleFileUpload}
                type="button"
                disabled={!file || loading}
              >
                Upload
              </button>
            </form>

            <button
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded-lg"
              disabled={!input || loading}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="w-1/2 bg-gray-800 p-8 rounded-lg ml-4 max-h-[80vh] overflow-auto">
          {/* <div className="w-full h-96 bg-gray-700 text-gray-100 p-4 rounded-lg grow-1 overflow-y-auto"> */}
          <div className=" text-gray-300">
            {!output && !loading
              ? "AI generated feedback will appear here."
              : loading
              ? "Loading... Because it's currently running on a free server, large texts may even take up to a minute to process."
              : handleOutput(output)}
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default App
