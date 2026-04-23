import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UserListPage from './pages/users/UserListPage';
import CreateUserPage from './pages/users/CreateUserPage';
import EditUserPage from './pages/users/EditUserPage';
import OrderListPage from './pages/orders/OrderListPage';
import CreateOrderPage from './pages/orders/CreateOrderPage';
import OrderDetailsPage from './pages/orders/OrderDetailsPage';
import InventoryManagementPage from './pages/inventory/InventoryManagementPage';
import InboundShipmentsPage from './pages/warehouse/InboundShipmentsPage';
import AddReceivedShipmentPage from './pages/warehouse/AddReceivedShipmentPage';
import PickingListPage from './pages/warehouse/PickingListPage';
import PickingListDetailsPage from './pages/warehouse/PickingListDetailsPage';
import PickingListManagementPage from './pages/warehouse/PickingListManagementPage';
import ShipmentsManagementPage from './pages/warehouse/ShipmentsManagementPage';
import CreateShipmentPage from './pages/warehouse/CreateShipmentPage';
import WarehouseOperationsPage from './pages/warehouse/WarehouseOperationsPage';
import WarehouseZoneManagementPage from './pages/warehouse/WarehouseZoneManagementPage';

function App() {
  const [route, setRoute] = React.useState("login");
  React.useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace("#", "") || "login";
      setRoute(hash);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);
  const navigate = React.useCallback((target) => {
    window.location.hash = "#" + target;
    setRoute(target);
  }, []);
  return (
    <AuthProvider>
      <InventoryProvider>
        <AppRouter route={route} navigate={navigate} />
      </InventoryProvider>
    </AuthProvider>
  );
}
function AppRouter({ route, navigate }) {
  const { isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    setSearchQuery("");
  }, [route]);

  if (loading) {
    return (
      <div
        className="loading-center"
        style={{
          minHeight: "100vh",
        }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  if (!isAuthenticated) {
    if (route === "signup") {
      return <SignupPage onNavigate={navigate} />;
    }
    return <LoginPage onNavigate={navigate} />;
  }
  if (route === "login" || route === "signup") {
    setTimeout(() => navigate("dashboard"), 0);
    return null;
  }
  const colonIdx = route.indexOf(":");
  const routeBase = colonIdx > -1 ? route.substring(0, colonIdx) : route;
  const routeParam = colonIdx > -1 ? route.substring(colonIdx + 1) : null;
  const renderPage = () => {
    switch (routeBase) {
      case "dashboard":
        return <DashboardPage searchQuery={searchQuery} onNavigate={navigate} />;
      case "users":
        return <UserListPage searchQuery={searchQuery} onNavigate={navigate} />;
      case "create-user":
        return <CreateUserPage onNavigate={navigate} />;
      case "edit-user":
        return <EditUserPage userId={routeParam} onNavigate={navigate} />;
      case "orders":
        return <OrderListPage searchQuery={searchQuery} onNavigate={navigate} />;
      case "create-order":
        return <CreateOrderPage onNavigate={navigate} />;
      case "order-details":
        return <OrderDetailsPage orderId={routeParam} onNavigate={navigate} />;
      case "inventory":
        return <InventoryManagementPage searchQuery={searchQuery} routeParam={routeParam} onNavigate={navigate} />;
      case "inbound-shipments":
        return <InboundShipmentsPage searchQuery={searchQuery} onNavigate={navigate} />;
      case "add-received-shipment":
        return <AddReceivedShipmentPage onNavigate={navigate} />;
      case "picking-lists":
        return <PickingListPage searchQuery={searchQuery} onNavigate={navigate} />;
      case "picking-details":
        return <PickingListDetailsPage listId={routeParam} onNavigate={navigate} />;
      case "picking-management":
        return <PickingListManagementPage onNavigate={navigate} />;
      case "shipments":
        return <ShipmentsManagementPage searchQuery={searchQuery} onNavigate={navigate} />;
      case "create-shipment":
        return <CreateShipmentPage onNavigate={navigate} />;
      case "warehouse-operations":
        return <WarehouseOperationsPage onNavigate={navigate} />;
      case "warehouse-zones":
        return <WarehouseZoneManagementPage onNavigate={navigate} />;
      default:
        return (
          <div className="empty-state">
            <span className="material-symbols-outlined">
              explore_off
            </span>
            <h3>
              Page Not Found
            </h3>
            <p>
              The page you're looking for doesn't exist.
            </p>
            <button
              className="btn btn-primary"
              style={{
                marginTop: "1rem",
              }}
              onClick={() => navigate("dashboard")}>
              Go to Dashboard
            </button>
          </div>
        );
    }
  };
  return (
    <Layout currentRoute={routeBase} onNavigate={navigate} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {renderPage()}
    </Layout>
  );
}


export default App;
