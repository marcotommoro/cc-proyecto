package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "keycloak"

  description: {

    srv: {
      server: {
        entrypoint: { protocol: "http", port: 8080 }
      }
      client: {
        dbclient: { protocol: "tcp" }
      }
    }

    config: {
      parameter: {
        keycloak_admin: string
        kc_proxy: *"edge" | string
        kc_http_enabled: *true | bool
        kc_hostname_strict: *false | bool
        kc_hostname_strict_https: *false | bool
        kc_db_url_host: *"0.dbclient" | string
        kc_db_url_port: *80 | number

        db_type: *"postgres" | string
        postgres_db: string
        postgres_user: string
        postgres_password: string
      }
      resource: {
        keycloak_password: k.#Secret
      }
    }

    size: {
      bandwidth: { size: 100, unit: "M" }
    }



    code: keycloak: {
      name: "keycloak"
      image: {
        hub: { name: "quay.io", secret: "" }
        tag: "keycloak/keycloak:20.0.2"
      }
      cmd: ["start-dev"]

      mapping: {

        env: {
          KEYCLOAK_ADMIN_PASSWORD: secret: "keycloak_password"
          KEYCLOAK_ADMIN: parameter: "keycloak_admin"
          KC_PROXY: parameter: "kc_proxy"
          KC_HTTP_ENABLED: parameter: "kc_http_enabled"
          KC_HOSTNAME_STRICT: parameter: "kc_hostname_strict"
          KC_HOSTNAME_STRICT_HTTPS: parameter: "kc_hostname_strict_https"
          KC_DB: parameter: "db_type"
          KC_DB_URL_HOST: parameter: "kc_db_url_host"
          KC_DB_URL_PORT: parameter: "kc_db_url_port"
          KC_DB_URL_DATABASE: parameter: "postgres_db"
          KC_DB_USERNAME: parameter: "postgres_user"
          KC_DB_PASSWORD: parameter: "postgres_password"
        }
      }
      size: {
        memory: { size: 2, unit: "G" }
        mincpu: 300
        cpu: { size: 2000, unit: "m" }
      }
    }

  }

}
