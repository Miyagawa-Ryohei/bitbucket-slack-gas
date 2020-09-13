
init : .clasp.json
	yarn install
	yarn clasp login
	yarn clasp create --rootDir ./src

setting src/slack_url.ts :
	echo "export const TARGET_URL =\""`cat .slackurl | sed r/\"//`"\"" > ./src/slack_url.ts

deploy : setting
	yarn clasp push
	yarn clasp deploy
	yarn clasp open


