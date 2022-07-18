#!/usr/bin/env bash
KEY=$1
SR_API_PREFIX=https://www.showroom-live.com/api
ROOMID=`curl -s "$SR_API_PREFIX/room/status?room_url_key=$KEY" | jq .room_id`
if [ "$ROOMID" = "null" ]; then
  echo Invalid room_url_key >&2
  exit 1
fi
PLAYLIST=`curl -s "$SR_API_PREFIX/live/streaming_url?room_id=$ROOMID" | jq -r '.streaming_url_list[0].url'`
if [ "$PLAYLIST" = "null" ]; then
  echo "$1 is inactive" >&2
  exit 1
fi
echo $PLAYLIST