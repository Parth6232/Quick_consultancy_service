import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage.jsx'
import AboutPage from '../pages/AboutPage.jsx'
import ServicesPage from '../pages/ServicesPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import BlogPage from '../pages/BlogPage.jsx'
import BlogDetailPage from '../pages/BlogDetailPage.jsx'
import CreateBlogPage from '../pages/CreateBlogPage.jsx'
import PortfolioPage from '../pages/PortfolioPage.jsx'
import PortfolioDetailPage from '../pages/PortfolioDetailPage.jsx'
import AddPortfolioPage from '../pages/AddPortfolioPage.jsx'
import AllReviewsPage from '../pages/AllReviewsPage.jsx'
import WriteReviewPage from '../pages/WriteReviewPage.jsx'
import SignupPage from '../pages/SignupPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import AdminLoginPage from '../pages/AdminLoginPage.jsx'
import ProtectedAdminRoute from '../common/ProtectedAdminRoute.jsx'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route
        path="/blog/create"
        element={
          <ProtectedAdminRoute>
            <CreateBlogPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/blog/edit/:id"
        element={
          <ProtectedAdminRoute>
            <CreateBlogPage />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route
        path="/portfolio/add"
        element={
          <ProtectedAdminRoute>
            <AddPortfolioPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/portfolio/edit/:id"
        element={
          <ProtectedAdminRoute>
            <AddPortfolioPage />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
      {/* Reviews routes */}
      <Route path="/reviews" element={<AllReviewsPage />} />
      <Route path="/reviews/write" element={<WriteReviewPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default AppRoutes