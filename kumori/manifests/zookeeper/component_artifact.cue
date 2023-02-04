package component

import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "zookeeper"

  description: {

    srv: {
      server: zookeepermain: port: 2181
    }

    config: {
      resource: zookeepervolume: k.#Volume
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: zookeeper: {
      name: "zookeeper"
      image: {
        hub: { name: "", secret: "" }
        tag: "bitnami/zookeeper"
      }

      user:{
        userid: 0
        groupid: 0
      }

      // cmd: ["start-dev"]

      mapping: {
        filesystem:{
          "/bitnami": volume: "zookeepervolume"
        }

        env: {
          ZOO_TICK_TIME: value: "2000"
          ZOO_PORT_NUMBER: value: "2181"
          ALLOW_ANONYMOUS_LOGIN: value: "yes"
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
