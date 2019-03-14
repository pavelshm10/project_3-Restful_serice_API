/// <reference path="jquery-3.3.1.js" />

"use strict";
$(function(){   
   
    let set = new Set();
    var flag=false;
    initilie(); 
    toggle(); 

    function initilie(){
        localStorage.clear();
        getAllData(set);
        $("#home").show();
        $("#about").hide();
        $("#report").hide();
    }//intilize data and home page
    
    function toggle(){
        //var flag=true;
        $("#homeLink").on("click",function(){
                //getAllData();
                $("#home").show();
                $("#about").hide();
                $("#report").hide();
                if (flag==true){
                    $('.coins:hidden').each(function() {
                        $(this).show();
                    })
                }

        });

        $("#reportLink").on("click",function(){
            if(set.size>0){
                makeReport();     
                $("#report").show();
                $("#about").hide();
                $("#home").hide();
            }
            else{
                alert("No coins were chosen for the report, Please go the Home and choose some!!!");   
            }
        });

        $("#aboutLink").on("click",function(){
                $("#about").show();
                $("#report").hide();
                $("#home").hide();
        });

        $(".search").on("click", function(){             
            var values=set.values();
            var input=$(".searchInput").val();                 
            console.log(input);                  
            for (let val of values){ //loop to get the comlete string for the url      
                var valUap=val.toUpperCase();
                console.log(valUap);                  
                if(valUap==input){
                    flag=true; //finf a match for the search
                    $(".check[id!="+val+"]").closest("div.coins").hide();
                    $(".searchInput").val("");
                }
            }
            if (flag==false){
                alert("There is no such coin in the list you picked fot the report");   
                $(".searchInput").val("");
                flag=true;
            }
        })
    }
   
    function makeReport(){
        
        try {
                var flag=false; //boolean check first enterance
                var values=set.values();
                var list=values.next().value;
                
                for(let val of values){ //loop to get the comlete string for the url      
                        list+=","+val;              
                }
                var upList=list.toUpperCase();
                
                var chart = new CanvasJS.Chart("chartContainer",{
                    exportEnabled: true,
	                animationEnabled: true,
                    theme: "light2",
                    title: {
                        text: upList+" to USD"
                    },
                    toolTip: {
                        shared: true
                    },
                    axisX: {
                        title: "Time"
                    },
                    axisY: {
                        title: "Coin Value"
                    },
                   
                    legend:{
                        cursor:"pointer",
                        verticalAlign: "bottom",
                        horizontalAlign: "left",
                        dockInsidePlotArea: true,
                        itemclick: toggleDataSeries
                    },
                    data: [     
                    ]//data
                });//option
                chart.render();
                updateData();

                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                }

                function addData(data){
                   
                    var i=0;
                    $.each(data,function(key,value){
                    var d=new Date();
                        d.setHours(d.getHours());
                        //first enterance
                        if (flag==false){  
                            chart.options.data[i]={};
                            chart.options.data[i].type="line";
                            chart.options.data[i].xValueType="dateTime";
                            chart.options.data[i].dataPoints=[];
                            chart.options.data[i].showInLegend=true;
                            chart.options.data[i].name=key;
                            chart.options.data[i].dataPoints.push({x:d.getTime(),y:value.USD});
                            i++;
                        }
                        else{
                            chart.options.data[i].dataPoints.push({x:d.getTime(),y:value.USD});
                            i++;
                        }
                    })
                    flag=true; 
                    chart.render();
                    setTimeout(updateData, 2000);   
                }
            
                function updateData() { 
                    $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms="+upList+"&tsyms=USD",addData);  
                }
        }//try
        catch (error) {
            alert("Error: " + error.status);
            //$("#data").append("Error: " + error.status);
        }
    }//function     
});



    



