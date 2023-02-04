package component

import k "kumori.systems/kumori:kumori"

#Files: _

#Artifact: {
  ref: name:  "kafka"
  description: {

    srv: {
      server: advertised: port: 9092
      duplex: internal: port: 29092
      client: zookeeperclient: _
    }

    config: {
     resource: kafkavolume: k.#Volume
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: kafka: {
      name: "kafka"
      image: {
        hub: { name: "", secret: "" }
        tag: "bitnami/kafka"
      }
      user:{
        userid: 0
        groupid: 0
      }
      entrypoint: ["/bin/cmd.sh"]
      mapping: {

        filesystem: {
          "/bin/cmd.sh":{
            data: value: #Files.cmd
            mode: 0o755
          }

          "/bitnami": volume: "kafkavolume"
        }

        env: {
          KAFKA_CFG_ZOOKEEPER_CONNECT: value: "set.0.zookeeperclient:2181"
          KAFKA_CFG_NUM_PARTITIONS: value: "10"
          ALLOW_PLAINTEXT_LISTENER: value: "yes"
          KAFKA_CFG_LISTENERS: value: "PLAINTEXT://:9092"
          ENTRY_ORIGINAL: value: "/opt/bitnami/scripts/kafka/entrypoint.sh"
          CMD_ORIGINAL: value: "/opt/bitnami/scripts/kafka/run.sh"
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