const registerForm = document.getElementById("registerForm");


registerForm.addEventListener("submit", async function(e){

    e.preventDefault();


    const user = {


        fullName:
        document.getElementById("fullName").value,


        email:
        document.getElementById("email").value,


        password:
        document.getElementById("password").value,


        phone:
        document.getElementById("phone").value,


        role:
        document.getElementById("role").value

    };



    try{


        const response = await fetch(
            "http://localhost:8080/api/users/register",
            {


                method:"POST",


                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify(user)

            });



        const data = await response.text();



        if(response.ok){


            alert(
                "Registration Successful!"
            );


            window.location.href="login.html";


        }

        else{


            alert(
                "Registration Failed : " + data
            );

        }



    }

    catch(error){


        console.log(error);


        alert(
            "Server Error. Please try again later."
        );

    }



});




// Password show/hide

const togglePassword =
document.getElementById("togglePassword");


togglePassword.onclick=function(){


    const password =
    document.getElementById("password");


    if(password.type==="password"){


        password.type="text";


        togglePassword.innerHTML="🙈";


    }

    else{


        password.type="password";


        togglePassword.innerHTML="👁";

    }


};