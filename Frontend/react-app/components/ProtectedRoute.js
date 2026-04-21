function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return React.createElement(
      "div",
      {
        className: "loading-center",
      },
      React.createElement("div", {
        className: "spinner spinner-lg",
      }),
    );
  }
  if (!isAuthenticated) return null;
  return children;
}
