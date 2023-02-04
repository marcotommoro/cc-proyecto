package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "postgres"

  description: {

    srv: {
      server: {
        dbserver: { protocol: "tcp", port: 5432 }
      }
    }

    config: {
      parameter: {
        postgres_db: string
        postgres_user: string
        postgres_password: string
      }
      resource: {
        postgres_volume: k.#Volume
      }
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: postgres: {
      name: "postgres"
      image: {
        hub: { name: "", secret: "" }
        tag: "postgres:15"
      }

      user:{
        userid: 0
        groupid: 0
      }

      // cmd: ["start-dev"]

      mapping: {

        env: {
          POSTGRES_DB: parameter: "postgres_db"
          POSTGRES_USER: parameter: "postgres_user"
          POSTGRES_PASSWORD: parameter: "postgres_password"
          PGDATA: value: "/var/lib/postgresql/data/pgdata"
        }
        filesystem: {
            "/var/lib/postgresql/data": {
              volume: "postgres_volume"
            }

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
