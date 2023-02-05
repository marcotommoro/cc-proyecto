package service

import (
  k "kumori.systems/kumori:kumori"
  i "kumori.systems/builtins/inbound/@1.1.0/inbound:service"
  mo ".../mongo:component"
  b ".../broker:component"
  mi ".../minio:component"
  fe ".../frontend:component"
  ob ".../observer:component"

  kui ".../kafkaui:component"
  kf ".../kafka:component"
  z ".../zookeeper:component"
)

#Artifact: {
  ref: name:  "service_main"

  description: {
    srv: server: discover: {port: 9092, protocol: "tcp"}
    config:{
      resource:{
        brokerdomain: k.#Domain
        miniodomain: k.#Domain
        frontenddomain: k.#Domain
        cert: k.#Certificate
        mongovolume: k.#Volume
        miniovolume: k.#Volume

        kafkauidomain: k.#Domain
        zookeepervolume: k.#Volume
        kafkavolume: k.#Volume

        keycloak_client_secret: k.#Secret
        minio_root_password: k.#Secret
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


      // Inbounds
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

      kafkauinbound: {
        artifact: i.#Artifact
        config: {
          parameter: {
            type: "https"
            websocket: true
          }
          resource: {
            servercert: description.config.resource.cert
            serverdomain: description.config.resource.kafkauidomain
          }
          resilience: description.config.resilience
        }
      }



      // Services
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
              keycloak_client_secret: description.config.resource.keycloak_client_secret
              minio_root_password: description.config.resource.minio_root_password
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


      // NEW
      kafkaui:{
        artifact: kui.#Artifact
        config: {
        }
      }

      kafka:{
        artifact: kf.#Artifact
        config: {
            resource: {
                kafkavolume: description.config.resource.kafkavolume
            }
        }
      }

      zookeeper:{
        artifact: z.#Artifact
        config: {
            resource: {
                zookeepervolume: description.config.resource.zookeepervolume
            }
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

      // NEW

      kafkauinboundconnector:{
        as: "lb"
		    from: kafkauinbound: "inbound"
        to: kafkaui: "web": _
      }

      zookeeperconnector: {
        as: "lb"
        from: kafka: "zookeeperclient"
        to: zookeeper: "zookeepermain": _
      }

      kafkaconnector: {
        as: "lb"
        from: self: "discover"
        from: kafkaui: "kafkaclient"
        from: observer: "kafkaclient"
        to: kafka: "advertised": _
      }

      // observerkafkaconnector:{
      //   as: "lb"
      //   from: observer: "kafkaclient"
      //   to:
      // }

    }
  }
}
