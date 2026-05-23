# Backend Modules

Add API domains here as the platform grows.

Recommended structure:

```text
modules/
  tests/
    test.model.js
    test.routes.js
    test.controller.js
    test.service.js
    test.validation.js
```

Controllers should handle HTTP request and response details. Services should contain business logic. Models should stay close to the feature that owns the data.
