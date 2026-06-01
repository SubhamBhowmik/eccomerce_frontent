import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// Styles
import './styles/global.css';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';

// Pages
import HomePage from './pages/Home/HomePage';
import CategoryProductsPage from './pages/CategoryProducts/CategoryProductsPage';
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage';
import LoginPage from './pages/Login/LoginPage';
import CartPage from './pages/Cart/CartPage';
import PaymentPage from './pages/Payment/PaymentPage';

// Routes
import { ROUTES } from './constants/app.constants';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Switch>
              <Route exact path={ROUTES.HOME} component={HomePage} />
              <Route exact path={ROUTES.CATEGORY} component={CategoryProductsPage} />
              <Route exact path={ROUTES.PRODUCT} component={ProductDetailPage} />
              <Route exact path={ROUTES.LOGIN} component={LoginPage} />
              <Route exact path={ROUTES.CART} component={CartPage} />
              <Route exact path="/payment" component={PaymentPage} />
              <Route path={ROUTES.NOT_FOUND}>
                <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>404 - Page Not Found</h1>
                  <p style={{ color: '#666' }}>The page you're looking for doesn't exist.</p>
                </div>
              </Route>
            </Switch>
          </main>
          <Footer />
        </div>
        <Toast />
      </Router>
    </Provider>
  );
}

export default App;
