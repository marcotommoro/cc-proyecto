package deployment

import (
    m ".../mongo:service"
)

#Deployment: {
    name: "mongo"
    artifact: m.#Artifact
    config: {
        resource: {
            mongovolume: volume: {size: 10, unit: "G"}
            domain1: domain: "boh"
            domain2: domain: "frontend"
            domain3: domain: "backend"
            cert: certificate: "cluster.core/wildcard-vera-kumori-cloud"
        }

    scale: detail: {
            mongo: hsize: 1
        }
    }
}