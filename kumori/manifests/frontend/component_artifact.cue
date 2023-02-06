package component

// TODO: complete this file

#Artifact: {
  ref: name:  "frontend"

  description: {

    srv: {
      server: entrypoint: port: 3000
    }

    config: {

    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: frontend: {
      name: "frontend"
      image: {
        hub: { name: "", secret: "" }
        tag: "marcotommoro/cc-frontend"
      }

      user:{
        userid: 0
        groupid: 0
      }

      mapping:{
        env:{
          NEXT_PUBLIC_KEYCLOAK_HOSTNAME: value: "https://auth.vera.kumori.cloud"
          BROKER_HOSTNAME: value: "https://server.vera.kumori.cloud"
          BROKER_HOSTNAME_EXTERNAL: value: "server.vera.kumori.cloud"
          NEXT_PUBLIC_BROKER_HOSTNAME: value: "https://server.vera.kumori.cloud"
          NEXT_PUBLIC_S3_HOSTNAME: value: "https://s3.vera.kumori.cloud"
        }
      }

      size: {
        memory: { size: 4, unit: "G" }
        mincpu: 1000
        cpu: { size: 2000, unit: "m" }
      }
    }

  }
}
