package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "mongo"

  description: {
    srv: {
      server: entrypoint: port: 27017
    }

    config: {
      resource: {
        mongovolume: k.#Volume
      }
    }

    size: {
      bandwidth: { size: 800, unit: "M" }
    }

    code: mongo: {
      name: "mongo"
      image: {
        hub: { name: "", secret: "" }
        tag: "mongo"
      }

      mapping: {
        env: {
          MONGO_INITDB_ROOT_USERNAME: value: "root"
          MONGO_INITDB_ROOT_PASSWORD: value: "JGUEs5mDfEg54mC"
          MONGO_INITDB_DATABASE: value: "admin"
          MONGO_REPLICA_SET_NAME: value: "rs0"
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
