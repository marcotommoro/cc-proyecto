#!/bin/bash

# Cluster variables
CLUSTERNAME="..."
REFERENCEDOMAIN="vera.kumori.cloud"
CLUSTERCERT="cluster.core/wildcard-vera-kumori-cloud"
KUMORICTL_CMD="kam ctl"
KAM_CMD="kam"
# Service variables
INBOUNDNAME="calcnodein"
DEPLOYNAME="keycloakdeploy"
DOMAIN="keycloak"
SECURITY_DOMAIN="keycloak"
SERVICEURL="ciao.${REFERENCEDOMAIN}"
SERVICE_SECURITY_URL="auth.${REFERENCEDOMAIN}"

case $1 in

'refresh-dependencies')
  cd manifests
  ${KAM_CMD} mod dependency --delete kumori.systems/kumori
  ${KAM_CMD} mod dependency kumori.systems/kumori/@1.0.11

  ${KAM_CMD} mod relink
  cd ..
  ;;

'create-domain')
  ${KUMORICTL_CMD} register domain $DOMAIN --domain $SERVICEURL
  ${KUMORICTL_CMD} register domain $SECURITY_DOMAIN --domain $SERVICE_SECURITY_URL
  ;;


'create-secrets')
  ${KUMORICTL_CMD} register secret keycloak_password --from-data v781rnSkQVu9d5
  ;;


'deploy-inbound')
  ${KUMORICTL_CMD} register inbound $INBOUNDNAME \
    --domain $DOMAIN \
    --cert $CLUSTERCERT
  ;;

'deploy-service')
  ${KUMORICTL_CMD} register deployment $DEPLOYNAME \
    --deployment ./manifests/deployment \
    --comment "Calc service" \
    --wait 5m
  ;;

'deploy-security-service')
  ${KUMORICTL_CMD} register deployment $DEPLOYNAME \
    --deployment ./manifests/deployment_keycloak \
    --comment "Keycloak and postgres" \
    --wait 5m
  ;;

'dry-run')
  time ${KUMORICTL_CMD} register deployment $DEPLOYNAME \
    --deployment ./manifests/deployment \
    --wait 5m --dry-run --keep-tmp-files
  ;;

# Before use this option, you must change the deployment manifest
'update-service')
  ${KUMORICTL_CMD} update deployment $DEPLOYNAME \
    --deployment ./manifests/deployment_keycloak \
    --comment "Updating keycloak service" \
    --wait 5m
  ;;

'link')
  ${KUMORICTL_CMD} link $DEPLOYNAME:calc $INBOUNDNAME:inbound
  ;;

'describe')
  ${KUMORICTL_CMD} describe deployment $DEPLOYNAME
  echo
  echo
  ${KUMORICTL_CMD} describe deployment $INBOUNDNAME
  ;;

# Test the calculator
'test')
  curl -sS -X POST  -d '{"expr": "sin(90)*5"}' -H "Content-Type: application/json" https://${SERVICEURL}/calc  | jq .
  #curl -sS -X POST  -d '{"expr": "wrong + expression"}' -H "Content-Type: application/json" https://${SERVICEURL}/calc  | jq .
  ;;

'unlink')
  ${KUMORICTL_CMD} unlink $DEPLOYNAME:calc $INBOUNDNAME:inbound
  ;;

'undeploy-service')
  ${KUMORICTL_CMD} unregister deployment $DEPLOYNAME --wait 5m
  ;;

'undeploy-inbound')
  ${KUMORICTL_CMD} unregister deployment $INBOUNDNAME --wait 5m
  ;;

'delete-domain')
  ${KUMORICTL_CMD} unregister domain $DOMAIN
  ;;

# Undeploy all (secrets, inbounds, deployments)
'undeploy-all')
  ${KUMORICTL_CMD} unlink $DEPLOYNAME:keycloak $INBOUNDNAME:inbound
  ${KUMORICTL_CMD} unregister deployment $DEPLOYNAME --wait 5m
  ${KUMORICTL_CMD} unregister deployment $INBOUNDNAME --wait 5m
  ${KUMORICTL_CMD} unregister domain $DOMAIN
  ;;

*)
  echo "This script doesn't contain that command"
	;;

esac