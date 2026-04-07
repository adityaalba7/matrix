import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="bg-primary-bg min-h-screen relative overflow-x-hidden text-text-primary flex flex-col">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}
