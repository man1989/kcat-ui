window.addEventListener("DOMContentLoaded", async (event) => {
    register();
    const {iskcatInstalled, message}  = await window.modules.comm.invoke("requirements"); 
    console.log(iskcatInstalled, message);
    if(!iskcatInstalled){
        alert(message);
    }
});

function register(){
    let now = new Date().toISOString();
    now = now.substring(0, now.length-1);
    document.getElementById("from").value = now;
    document.getElementById("to").value = now;
    document.querySelector("form").addEventListener("submit", async function(e){
        e.preventDefault()
        const data = new FormData(e.target);
        const data_json = {}
        for(const[key, value] of data.entries()){
            data_json[key]  = value;
            if(["from", "to"].indexOf(key)!=-1){
                data_json[`${key}_epoch`]  = new Date(value + "+00:00").getTime()
            }
        }
        const responseEl = document.querySelector("#response");
        responseEl.innerText = "loading .....";  
        window.modules.comm.send("kcat", data_json);
        let isFirstByte = true;
        window.modules.comm.on("kcat", (_, data) => {
            if(isFirstByte){
                responseEl.innerText = "";
                isFirstByte=false;    
            }
            console.log(data);
            responseEl.innerText += data
        })
    });
    // document.querySelector("#env").addEventListener("change", ()  =>  {})
    // document.querySelector(".autocomplete").on("input", (e) =>  {
    //     if(e.target.value.length<=2){
    //         return
    //     }
    //     document.querySelector(".autocomplete-list");
    // })
}
