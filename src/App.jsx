import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import { v4 as uuidV4 } from "uuid";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={`/documents/${uuidV4()}`} replace />} 
        />
        <Route 
          path="/documents/:id" 
          element={<TextEditor />} 
        />
      </Routes>
    </Router>
  );
}