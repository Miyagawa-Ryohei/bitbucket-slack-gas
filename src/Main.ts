import DoPost = GoogleAppsScript.Events.DoPost;
import {Logging, LogLebel} from "./Logging";
import HttpMethod = GoogleAppsScript.URL_Fetch.HttpMethod;
import {TARGET_URL} from "./slack_url";

const SLACKURL = TARGET_URL

const doPost = (e:DoPost) => {
    const param = JSON.parse(e.postData.contents)
    const logger = Logging.getNewLogger("slack-notify", LogLebel.Debug)
    logger.info(JSON.stringify(param));
    let jsonData = {
            "username" : "bit bucket",
            "icon_emoji": ":hatching_chick:",
            "text" : ""
    };
    if("push" in param){
        if(param.repository?.name !== "develop") return 200;
        jsonData.text = "developブランチが更新されました。\n actor : " + param.actor.display_name
    }
    if("pullrequest" in param) {
        if(param.pullrequest?.destination.branch?.name !== "develop") return 200;
        if(param.pullrequest.state === "MERGED"){
            const text =
                ` プルリクがマージされ、Developブランチが更新されました。` +
                `\n ID : ` + param.pullrequest.id +
                `\n 投稿者 : ` + param.pullrequest.author.display_name +
                `\n URL : https://bitbucket.org/etc-proj/scraper-ts/pull-requests/${param.pullrequest.id}` +
                `\n` + param.pullrequest.source.branch.name +　` → ` + param.pullrequest.destination.branch.name +
                `\n--- 説明 ---\n` + param.pullrequest.description
        }
        const text =
            ` プルリクに変更があります。` +
            `\n ID : ` + param.pullrequest.id +
            `\n URL : https://bitbucket.org/etc-proj/scraper-ts/pull-requests/${param.pullrequest.id}` +
            `\n 投稿者 : ` + param.pullrequest.author.display_name +
            `\n 状態 : ` + param.pullrequest.state +
            `\n` + param.pullrequest.source.branch.name +　` → ` + param.pullrequest.destination.branch.name +
            `\n--- 説明 ---\n` + param.pullrequest.description
        jsonData.text = text;
    }

    let payload = JSON.stringify(jsonData);
    logger.info(payload);
    let options =
        {
            "method" : "post" as HttpMethod,
            "contentType" : "application/json",
            "payload" : payload
        };

    UrlFetchApp.fetch(SLACKURL, options);

}