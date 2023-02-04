package service

import (
  k "kumori.systems/kumori:kumori"
  i "kumori.systems/builtins/inbound/@1.1.0/inbound:service"
  mo ".../mongo:component"
  b ".../broker:component"
  mi ".../minio:component"
  fe ".../frontend:component"
  ob ".../observer:component"
)

#Artifact: {
  ref: name:  "service_main"

  description: {
    config:{
      resource:{
        brokerdomain: k.#Domain
        miniodomain: k.#Domain
        frontenddomain: k.#Domain

        cert: k.#Certificate

        mongovolume: k.#Volume
        miniovolume: k.#Volume
      }
    }
    role: {
      broker_inbound: {
        artifact: i.#Artifact
        config: {
          parameter: {
            type: "https"
            websocket: true
          }
          resource: {
            servercert: description.config.resource.cert
            serverdomain: description.config.resource.brokerdomain
          }
          resilience: description.config.resilience
        }
      }

      minio_inbound: {
        artifact: i.#Artifact
        config: {
          parameter: {
            type: "https"
            websocket: true
          }
          resource: {
            servercert: description.config.resource.cert
            serverdomain: description.config.resource.miniodomain
          }
          resilience: description.config.resilience
        }
      }

      frontend_inbound: {
        artifact: i.#Artifact
        config: {
          parameter: {
            type: "https"
            websocket: true
          }
          resource: {
            servercert: description.config.resource.cert
            serverdomain: description.config.resource.frontenddomain
          }
          resilience: description.config.resilience
        }
      }

      minio:{
        artifact: mi.#Artifact
        config: {
            resource: {
                miniovolume: description.config.resource.miniovolume
            }
            resilience: description.config.resilience
        }
      }

      frontend:{
        artifact: fe.#Artifact
        config: {
            resource: {
            }
            resilience: description.config.resilience
        }
      }


      observer: {
        artifact: ob.#Artifact
        config: {
            resource: {
            }
            resilience: description.config.resilience
        }
      }

      broker:{
        artifact: b.#Artifact
        config: {
            resource: {
            }
            resilience: description.config.resilience
        }
      }

      mongo:{
        artifact: mo.#Artifact
        config: {
            resource: {
                mongovolume: description.config.resource.mongovolume
            }
            resilience: description.config.resilience
        }
      }

    }

    srv:{}

    connect: {
      brokerinboundconnector: {
        as: "lb"
		    from: broker_inbound: "inbound"
        to: broker: "entrypoint": _
      }

      minioinboundconnector: {
        as: "lb"
		    from: minio_inbound: "inbound"
        to: minio: "entrypoint": _
      }

      frontendinboundconnector: {
        as: "lb"
		    from: frontend_inbound: "inbound"
        to: frontend: "entrypoint": _
      }

      observermongoconnector:{
        as: "lb"
        from: observer: "mongoclient"
        to: mongo: "entrypoint": _
      }

      mongoconnector: {
        as: "lb"
        from: broker: "mongoclient"
        to: mongo: "entrypoint": _
      }

      brokerminioconnector: {
        as: "lb"
        from: broker: "minioclient"
        to: minio: "entrypoint": _
      }

    }
  }
}
