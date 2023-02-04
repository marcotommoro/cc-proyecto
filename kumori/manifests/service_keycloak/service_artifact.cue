package service

import (
  k "kumori.systems/kumori:kumori"
  i "kumori.systems/builtins/inbound/@1.1.0/inbound:service"
  kc ".../keycloak:component"
  pg ".../postgres:component"
)

#Artifact: {
  ref: name:  "service_keycloak"

  description: {
    config: {
      parameter: {
        postgres: {
          postgres_db: string
          postgres_user: string
          postgres_password: string
        }
        keycloak: {
          keycloak_admin: string
        }
      }

      resource: {
        keycloak_password: k.#Secret
        postgres_volume:  k.#Volume
        server_cert:  k.#Certificate
        domain: k.#Domain
      }
    }

    let _postgres_db = description.config.parameter.postgres.postgres_db
    let _postgres_user = description.config.parameter.postgres.postgres_user
    let _postgres_password = description.config.parameter.postgres.postgres_password
    let _keycloak_admin = description.config.parameter.keycloak.keycloak_admin
    let _keycloak_password = description.config.resource.keycloak_password


    role: {
      keycloak_inbound: {
        artifact: i.#Artifact
        config: {
          parameter: {
            type: "https"
            websocket: true
          }
          resource: {
            servercert: description.config.resource.server_cert
            serverdomain: description.config.resource.domain
          }
          resilience: description.config.resilience
        }
      }
      keycloak: {
        artifact: kc.#Artifact
        config: {
          parameter: {
            postgres_db: _postgres_db
            postgres_user: _postgres_user
            postgres_password: _postgres_password
            keycloak_admin: _keycloak_admin
          }
          resource: {
            keycloak_password: _keycloak_password
          }
          resilience: description.config.resilience
        }
      }
      postgres: {
        artifact: pg.#Artifact
        config: {
          parameter: {
            postgres_db: _postgres_db
            postgres_user: _postgres_user
            postgres_password: _postgres_password
          }
          resource: {
            postgres_volume: description.config.resource.postgres_volume
          }
          resilience: description.config.resilience
        }
      }
    }

    srv: {
    }

    connect: {
      serviceconnector: {
        as: "lb"
			  from: keycloak_inbound: "inbound"
        // lo mismo que en el componente
        to: keycloak: "entrypoint": _
      }
      dbconnector: {
        as: "lb"
        from: keycloak: "dbclient"
        to: postgres: "dbserver": _
      }
    }
  }
}
