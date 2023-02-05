package component

#Artifact: {
  ref: name:  "observer"

  description: {

    srv: {
      server: web: port: _
      client: mongoclient: protocol: "tcp"
      client: kafkaclient: protocol: _
    }

    config: {
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: observer: {
      name: "observer"
      image: {
        hub: { name: "", secret: "" }
        tag: "marcotommoro/cc-observer:latest"
      }

      user:{
        userid: 0
        groupid: 0
      }

      mapping:{
        env:{
          MONGO_HOSTNAME: value: "0.mongoclient:80"
          MONGO_DB: value: "admin"
          MONGO_USER: value: "root"
          MONGO_PASSWD: value: "JGUEs5mDfEg54mC"
          MONGO_PARAMS: value: "maxPoolSize=20&w=majority&authMechanism=DEFAULT"
          MONGO_COLLECTION: value: "observer-setting"
          KAFKA_BROKER_HOSTNAME: value: "0.kafkaclient:80"
        }
      }

      size: {
        memory: { size: 2, unit: "G" }
        mincpu: 1000
        cpu: { size: 2000, unit: "m" }
      }
    }

  }
}
