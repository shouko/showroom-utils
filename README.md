# Showroom Utils
Showroom 自動化相關工具 (目前只有手動下載)

## Dependencies
- `node`
- `yarn`
  - `npm install -g yarn`

## Usage
### app.js
```bash
# 取得 `46_RISA_WATANABE` 的直播最佳 playlist 網址
$ node download.js playlist 46_RISA_WATANABE
https://hls-origin243...../chunklist.m3u8

# 直接貼網址也可以
$ node download.js playlist https://www.showroom-live.com/r/48_Haruna_Hashimoto
https://hls-origin243...../chunklist.m3u8

# 下載 `46_RISA_WATANABE` 的直播到 output.ts
$ node download.js download 46_RISA_WATANABE output.ts

# 下載 `akb48_asuyoro` 的直播，並使用 ffmpeg 做後續處裡
$ node download.js download akb48_asuyoro pipe:1 | ffmpeg -i pipe:0 -c copy ....

# 下載 `akb48_asuyoro` 的直播，並使用 rclone 直接上傳到遠端
$ node download.js download akb48_asuyoro pipe:1 | rclone rcat -vvv REMOTE:/FOO/BAR/FILENAME.ts
```

## TODO
 - 排程檢查，開播自動開始錄
 - 網頁介面用來查看抓取狀況