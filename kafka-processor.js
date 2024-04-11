const { exec, execSync} = require("node:child_process")
const mappingJson = require("./db/mapping.json");

let kcatPath = "/usr/local/bin/kcat";
// try{
//     kcatPath = execSync("which kcat").toString();
//     kcatPath = kcatPath.replace("\n", "");
// }catch(e){
//     kcatPath = null;
// }

const getRequirements = () => {
    return {
        "iskcatInstalled": kcatPath,
        "message": "Please install kcat from https://github.com/edenhill/kcat"
    }
}

console.log("kcatPath: ", getRequirements());

function kcatExecutor(event, sender, data){
    // console.log(mappingJson);
    const topicConfig = mappingJson[data.env];
    console.log(topicConfig);
    
    let command = `${kcatPath} -b ${topicConfig.server} -C -t ${data.topic} -o s@${data.from_epoch} -o e@${data.to_epoch} -c ${data.limit} -e`;
    if(data.filter){
        command  += ` | grep '${data.filter}'`
    }
    command += ` | awk '1;{print ""}'`
    console.log(command);
    const kcat = exec(command);
    kcat.stdout.on("data", (data)  => {
        // console.log(data);
        sender.send(event, data);
    });
    kcat.stderr.on("data", (data) =>  {
        // console.log(data)
        sender.send(event, data);
    })
    // sender.send(event, command);
}

module.exports = {kcatExecutor, getRequirements};