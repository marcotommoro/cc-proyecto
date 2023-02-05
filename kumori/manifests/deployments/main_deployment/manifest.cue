package deployment

import (
    m ".../main:service"
)

#Deployment: {
    name: "main"
    artifact: m.#Artifact
    config: {
        resource: {
            mongovolume: volume: {size: 10, unit: "G"}
            miniovolume: volume: {size: 10, unit: "G"}

            brokerdomain: domain: "server"
            miniodomain: domain: "s3"
            frontenddomain: domain: "web"
            cert: certificate: "cluster.core/wildcard-vera-kumori-cloud"


            kafkavolume: volume: {size: 10, unit: "G"}
            zookeepervolume: volume: {size: 2, unit: "G"}
            kafkauidomain: domain: "kafkauiweb"

            keycloak_client_secret: secret: "keycloak_client_secret"
            minio_root_password: secret: "minio_root_password"
        }

    scale: detail: {
            mongo: hsize: 1
            broker: hsize: 1
            minio: hsize: 1
            frontend: hsize: 1
            observer: hsize: 1

            kafkaui: hsize: 1
            kafka: hsize: 1
            zookeeper: hsize: 1
        }
    }
}