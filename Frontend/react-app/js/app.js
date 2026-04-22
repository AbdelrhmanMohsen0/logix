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
  return React.createElement(
    AuthProvider,
    null,
    React.createElement(AppRouter, {
      route: route,
      navigate: navigate,
    }),
  );
}
function AppRouter({ route, navigate }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return React.createElement(
      "div",
      {
        className: "loading-center",
        style: {
          minHeight: "100vh",
        },
      },
      React.createElement("div", {
        className: "spinner spinner-lg",
      }),
    );
  }
  if (!isAuthenticated) {
    if (route === "signup") {
      return React.createElement(SignupPage, {
        onNavigate: navigate,
      });
    }
    return React.createElement(LoginPage, {
      onNavigate: navigate,
    });
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
        return React.createElement(DashboardPage, {
          onNavigate: navigate,
        });
      case "users":
        return React.createElement(UserListPage, {
          onNavigate: navigate,
        });
      case "create-user":
        return React.createElement(CreateUserPage, {
          onNavigate: navigate,
        });
      case "edit-user":
        return React.createElement(EditUserPage, {
          userId: routeParam,
          onNavigate: navigate,
        });
      case "orders":
        return React.createElement(OrderListPage, {
          onNavigate: navigate,
        });
      case "create-order":
        return React.createElement(CreateOrderPage, {
          onNavigate: navigate,
        });
      case "order-details":
        return React.createElement(OrderDetailsPage, {
          orderId: routeParam,
          onNavigate: navigate,
        });
      case "inventory":
        return React.createElement(InventoryManagementPage, {
          onNavigate: navigate,
        });
      case "inbound-shipments":
        return React.createElement(InboundShipmentsPage, {
          onNavigate: navigate,
        });
      case "add-received-shipment":
        return React.createElement(AddReceivedShipmentPage, {
          onNavigate: navigate,
        });
      case "picking-lists":
        return React.createElement(PickingListPage, { onNavigate: navigate });
      case "picking-details":
        return React.createElement(PickingListDetailsPage, {
          listId: routeParam,
          onNavigate: navigate,
        });
      case "picking-management":
        return React.createElement(PickingListManagementPage, {
          onNavigate: navigate,
        });
      case "shipments":
        return React.createElement(ShipmentsManagementPage, {
          onNavigate: navigate,
        });
      case "create-shipment":
        return React.createElement(CreateShipmentPage, {
          onNavigate: navigate,
        });
      case "warehouse-operations":
        return React.createElement(WarehouseOperationsPage, {
          onNavigate: navigate,
        });
      case "warehouse-zones":
        return React.createElement(WarehouseZoneManagementPage, {
          onNavigate: navigate,
        });
      default:
        return React.createElement(
          "div",
          {
            className: "empty-state",
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
            },
            "explore_off",
          ),
          React.createElement("h3", null, "Page Not Found"),
          React.createElement(
            "p",
            null,
            "The page you're looking for doesn't exist.",
          ),
          React.createElement(
            "button",
            {
              className: "btn btn-primary",
              style: {
                marginTop: "1rem",
              },
              onClick: () => navigate("dashboard"),
            },
            "Go to Dashboard",
          ),
        );
    }
  };
  return React.createElement(
    Layout,
    {
      currentRoute: routeBase,
      onNavigate: navigate,
    },
    renderPage(),
  );
}
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App, null));
