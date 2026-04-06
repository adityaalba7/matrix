import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div className="bg-primary-bg min-h-screen relative overflow-x-hidden text-text-primary flex flex-col">
      <RouterProvider router={router} />
    </div>
  );
}
