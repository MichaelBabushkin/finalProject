function validate(){
    var alertText="";
    var f=theform.ch.value;  
    var r=theform.ch.value; 
    var s=theform.ch.value;
    var fn=document.getElementById("firstname").value;
    var ln=theform.lastname.value;
    var m=theform.email.value;
    var co=theform.country.value;
    var ag=theform.age.value;
    var ad=theform.address.value; 
    if(fn===""){alertText=alertText+"1-please enter firstname\n";}    
    if(ln===""){alertText+="2-please enter lastname\n";}    
    if(m===""){alertText+="3-please enter email\n";}    
    if(ag===""){alertText+=" 4-please enter Age\n";}       
    if(ad===""){alertText+="5- please enter adress\n";}    
    if(co===""){alertText+="6-please enter country\n";}    
    if(isNaN(ag)){ window.alert(" The Age NOT Number");}
    var group = theform.ch;
    for (var i=0; i<group.length; i++) {
    if (group[i].checked)
    break;
    }
    if (i==group.length){
    alertText+="7-please enter interests\n";
    }
    
    if(alertText!=="") {window.alert(alertText);}
    if(m.indexOf('@')==-1 && m.indexOf('\.')==-1) window.alert("The Email without the @ and dot");
    }//end function