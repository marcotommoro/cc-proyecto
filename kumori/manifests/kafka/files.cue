package component

#Files: {
    _in: _

    cmd:
"""
#!/bin/bash

TMP=`getent ahostsv4 $HOSTNAME | grep  $HOSTNAME`

SELF=${TMP%% *}

export KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://$SELF:9092

echo $ENTRY_ORIGINAL $CMD_ORIGINAL

exec $ENTRY_ORIGINAL $CMD_ORIGINAL

"""
}