package deployment
// If a package name other than "deployment" is used, then the
// "kumorictl register deployment" operation must include the "--package" flag.

import (
  s ".../service_keycloak:service"
)

#Deployment: {
  name: "keycloak"
  artifact: s.#Artifact
  config: {
    parameter: {
      postgres: {
        postgres_db: "keycloak"
        postgres_user: "keycloak"
        postgres_password: "keycloak"
      }
      keycloak: {
        keycloak_admin: "admin"
      }
    }

    resource: {
      keycloak_password: secret: "keycloak_password"
      postgres_volume: volume: { size: 5, unit: "G" }
      server_cert: certificate: "cluster.core/wildcard-vera-kumori-cloud"
      domain: domain: "keycloak"
    }
    scale: detail: {
      keycloak: hsize: 1
      postgres: hsize: 1
    }
    resilience: 0
  }
}
