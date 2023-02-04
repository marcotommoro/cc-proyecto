package deployment

import (
    s ".../kafka:service"
)

#Deployment: {
    name: "kafka"
    artifact: s.#Artifact
    config: {
        resource: {
            kafkavolume: volume: {size: 10, unit: "G"}
            zookeepervolume: volume: {size: 2, unit: "G"}
            kafkauidomain: domain: "kafkaui"
            kafkabrokerdomain: domain: "kafkabroker"
            cert: certificate: "cluster.core/wildcard-vera-kumori-cloud"
        }

    scale: detail: {
            kafkaui: hsize: 1
            kafka: hsize: 1
            zookeeper: hsize: 1
        }
    }
}