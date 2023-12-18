// Middleware function to list all routes
const listRoutes = (req, res, next) => {
    const routes = [];
    
    // Iterate over each route
    req.app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // Routes registered directly on the app
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods),
        });
      } else if (middleware.name === 'router') {
        // Routes registered on routers
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          routes.push({
            path: route.path,
            methods: Object.keys(route.methods),
          });
        });
      }
    });
  
    // Send the list of routes as a response
    res.json({ routes });
  };
  
  // Apply the middleware to list routes
module.exports = listRoutes;  