const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const fetch = require('node-fetch');

const fetchApiJson = async (url) => fetch(url).then(r => r.json());

const srApiPrefix = 'https://www.showroom-live.com/api';
const getRoomApiUrl = (roomUrlKey) => `${srApiPrefix}/room/status?room_url_key=${roomUrlKey}`;
const getStreamingApiUrl = (roomId) => `${srApiPrefix}/live/streaming_url?room_id=${roomId}`;

async function run({
  command, input, output,
}) {

  const filteredInput = String(input).split('?')[0].split('/').pop();
  if (!filteredInput) {
    console.error('Invalid `room_url_key`');
    process.exit(1);
  }

  const requiresOutput = ['download'];
  if (requiresOutput.indexOf(command) !== -1 && !output) {
    console.error('Invalid output');
    process.exit(1);
  }

  try {
    const { is_live, room_id, room_name } = await fetchApiJson(getRoomApiUrl(filteredInput));
    if (!is_live) {
      console.error('Live stream not active');
      process.exit(1);
    }

    console.error({ is_live, room_id, room_name });
    const { streaming_url_list } = await fetchApiJson(getStreamingApiUrl(room_id));
    if (!Array.isArray(streaming_url_list) || streaming_url_list.length == 0) {
      console.error('No streaming URL found');
      process.exit(1);
    }

    const { url: bestPlaylistUrl } = streaming_url_list.filter(({type}) => type == 'hls').reduce((a, b) => a.quality >= b.quality ? a : b);

    if (command == 'playlist') {
      console.log(bestPlaylistUrl);
      return;
    }
  
    if (command == 'download') {
      const subprocess = spawn(ffmpegPath, ['-i', bestPlaylistUrl, '-c', 'copy', '-f', 'mpegts', output], {
        stdio: ['inherit', 'inherit', 'inherit']
      });
    }
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

if (require.main === module) {
  // run as script
  const [_node, _script, command, input, output] = process.argv;
  run({
    command,
    input,
    output,
  });
}
