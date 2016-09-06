(() => {
    document.getElementById("fileUpload").onchange = () => {
        const files = document.getElementById("fileUpload").files;
        const file = files[0];
        
        if(file === null){
            return alert ("no file selected.");
        }
        getSignedRequest(file);
    }
})();

function getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            }
            else{
                alert("could not get signed URL.");
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 2000){
                document.getElementById("fileLink").value = url;
                console.log("File uploaded to " + url);
            }
        }
        else {
            console.log("Couldn't upload file");
        }
    };
    xhr.send(file);
}