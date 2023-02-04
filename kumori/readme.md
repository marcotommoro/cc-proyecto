# Some commands

    kam ctl get all

Show somethings like this
```
Deployments:
mmoroni/bellali-inbound
mmoroni/keycloakdeploy
mmoroni/nodedep
Certificates:
admin/wildcard-arfima-vera-kumori-cloud
cluster.core/wildcard-vera-kumori-cloud
Secrets:
mmoroni/keycloak_password
Ports:
Volumes:
Domains:
mmoroni/bellali
mmoroni/keycloak
CAs:

```

### Create a domain
    kumorictl register domain <domain> -d <domain>.vera.kumori.cloud


### Create a deployment
    kam ctl deploy <deploy_name> -d <deployment_folder>
    ex: kam ctl deploy codekafka -d ./deployments/kafka
