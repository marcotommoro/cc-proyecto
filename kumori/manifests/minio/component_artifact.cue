package component
import k "kumori.systems/kumori:kumori"

#Artifact: {
  ref: name:  "minio"

  description: {

    srv: {
      server: entrypoint: port: 9000

    }

    config: {
      resource: {
        miniovolume: k.#Volume
      }
    }

    size: {
      bandwidth: { size: 1000, unit: "M" }
    }

    code: minio: {
      name: "minio"
      image: {
        hub: { name: "", secret: "" }
        tag: "minio/minio"
      }
      // entrypoint: [" server /data"]
      entrypoint: ["minio", "server", "/data"]
      // cmd: ["server /data"]

      user:{
        userid: 0
        groupid: 0
      }

      mapping:{
        env:{
          MINIO_ROOT_USER: value: "root"
          MINIO_ROOT_PASSWORD: value: "6fd37861-d2a9-4aa3-8a1f-52559367223a"
        }
        filesystem:{
          "/data":{
            volume: "miniovolume"
          }
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
