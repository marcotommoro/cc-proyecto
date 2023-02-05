package component

import (
  k "kumori.systems/kumori:kumori"

)

#Artifact: {
  ref: name:  "broker"

  description: {
    srv: {
      server: {
        entrypoint: { protocol: "http", port: 5001 }
      }
      client: {
        mongoclient: { protocol: "tcp" }
        minioclient: { protocol: "tcp" }
      }
    }

    config: {
      parameter: {
      }

      resource: {
        keycloak_client_secret: k.#Secret
        minio_root_password: k.#Secret
      }
    }

    size: {
      bandwidth: { size: 800, unit: "M" }
    }

    code: broker: {
      name: "broker"
      image: {
        hub: { name: "", secret: "" }
        tag: "marcotommoro/cc-broker:latest"
      }

      mapping: {
        env: {
          KEYCLOAK_CLIENT_SECRET: secret: "keycloak_client_secret"
          KEYCLOAK_USERNAME: value: "user_app"
          KEYCLOAK_CLIENT_ID: value: "backend-app"
          KEYCLOAK_HOSTNAME: value: "https://auth.vera.kumori.cloud"
          MONGO_HOSTNAME: value: "0.mongoclient:80"
          MONGO_DB: value: "admin"
          MONGO_USER: value: "root"
          MONGO_PASSWD: value: "JGUEs5mDfEg54mC"
          MONGO_PARAMS: value: "maxPoolSize=20&w=majority&authMechanism=DEFAULT"
          MONGO_COLLECTION: value: "observer-setting"
          MINIO_ROOT_USER: value: "root"
          MINIO_ROOT_PASSWORD: secret: "minio_root_password"
          MINIO_HOSTNAME: value: "0.minioclient"
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
