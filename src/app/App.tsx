import { Routes, Route, Outlet } from "react-router";
import Home from "./pages/Student/home";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import AdminPanel from "./pages/Admin/adminPanel";
import EditLesson from "./pages/Admin/editLesson";
import ViewLesson from "./pages/Student/lessonDetailView";
import Layout from "@/components/layout/layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import NotFound from "@/components/notfound";

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Outlet />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="lesson/edit/:lessonId"
              element={
                <ProtectedRoute>
                  <EditLesson />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="lesson/:lessonId"
            element={
              <ProtectedRoute>
                <ViewLesson />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
