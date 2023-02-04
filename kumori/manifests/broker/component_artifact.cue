package component


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

      }
    }

    size: {
      bandwidth: { size: 800, unit: "M" }
    }

    code: broker: {
      name: "broker"
      image: {
        hub: { name: "", secret: "" }
        tag: "marcotommoro/cc-broker"
      }

      mapping: {
        env: {
          KEYCLOAK_CLIENT_SECRET: value: "Jf5UhAu9SFltve3GuQhjl3DrskBJnJtp"
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
          MINIO_ROOT_PASSWORD: value: "6fd37861-d2a9-4aa3-8a1f-52559367223a"
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
