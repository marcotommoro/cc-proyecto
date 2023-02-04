package service

import (
  k "kumori.systems/kumori:kumori"
  i "kumori.systems/builtins/inbound/@1.1.0/inbound:service"
  kui ".../kafkaui:component"
  kf ".../kafka:component"
  z ".../zookeeper:component"
)

#Artifact: {
  ref: name:  "service_kafka"

  description: {
    srv: server: discover: {port: 9092, protocol: "tcp"}

    config:{
      resource:{
        kafkauidomain: k.#Domain
        kafkabrokerdomain: k.#Domain
        cert: k.#Certificate
        zookeepervolume: k.#Volume
        kafkavolume: k.#Volume
      }
    }

    let _cfgr = description.config.resource

    role: {
      csinbound: {
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

      kafkabrokerinbound: {
        artifact: i.#Artifact
        config: {
          parameter: {
            type: "https"
            websocket: true
          }
          resource: {
            servercert: description.config.resource.cert
            serverdomain: description.config.resource.kafkabrokerdomain
          }
          resilience: description.config.resilience
        }
      }

      kafkaui:{
        artifact: kui.#Artifact
        config: {
        }
      }

      kafka:{
        artifact: kf.#Artifact
        config: {
            resource: {
                kafkavolume: _cfgr.kafkavolume
            }
        }
      }

      zookeeper:{
        artifact: z.#Artifact
        config: {
            resource: {
                zookeepervolume: _cfgr.zookeepervolume
            }
        }
      }

    }

    srv:{}

    connect: {
      inboundconnector: {
        as: "lb"
		    from: csinbound: "inbound"
        to: kafkaui: "web": _
      }

      inboundkafkaconncetor: {
        as: "lb"
        from: kafkabrokerinbound: "inbound"
        to: kafka: "advertised": _
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
        to: kafka: "advertised": _
      }
    }
  }
}
