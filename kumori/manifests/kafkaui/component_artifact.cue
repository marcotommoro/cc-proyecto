package component

#Artifact: {
  ref: name:  "kafkaui"

  description: {

    srv: {
      server: web: port: 8080
      client: kafkaclient: _
    }

    config: {
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: kafkaui: {
      name: "kafkaui"
      image: {
        hub: { name: "", secret: "" }
        tag: "provectuslabs/kafka-ui:latest"
      }

      user:{
        userid: 0
        groupid: 0
      }

      mapping:{
        env:{
          KAFKA_CLUSTERS_0_NAME: value: "local"
          KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: value: "0.kafkaclient:80"
          // KAFKA_CLUSTERS_0_METRICS_PORT: value: "9997"
        }
      }

      size: {
        memory: { size: 1, unit: "G" }
        mincpu: 1000
        cpu: { size: 2000, unit: "m" }
      }
    }

  }
}
