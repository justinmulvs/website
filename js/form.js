let url = "https://docs.google.com/forms/d/e/1FAIpQLScM1mdyqTJ6Zx-lERD9i_KwrFDcLXWXhKtgFeL1fylTMuJe2Q/formResponse"
let form = document.querySelector("#contactForm"); //form element

form.addEventListener("submit", (e)=>{
    e.preventDefault();//prevent default behaviour

    fetch(url,{
        method: "POST",
        mode: "no-cors",
        header:{
            'Content-Type': 'application/json'
            },
        body: getInputData()
    })
    .then(data=>{
        console.log(data);
        document.getElementById("contactForm").innerHTML= `<p class="success">Thanks for your interest in coaching! I'll reach out within 1-3 business days.</p>`
    })
    .catch(err=>console.error(err)); //promise based
});

//populating input data
function getInputData(){
    let dataToPost = new FormData(); //formdata API

    //fill name attributes to corresponding values
    dataToPost.append("entry.1655036938", document.querySelector("#name").value);
    dataToPost.append("entry.319172432", document.querySelector("#email").value);
    dataToPost.append("entry.1332314203", document.querySelector("#career").value);
    dataToPost.append("entry.1531190884", document.querySelector("#offerings").value);
    dataToPost.append("entry.1625373356", document.querySelector("#interest").value);
    dataToPost.append("entry.796222772", document.querySelector("#additional").value);
    
    return dataToPost;
}
